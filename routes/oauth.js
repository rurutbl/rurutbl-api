const path = require("path")
const fs = require("fs")

function newToken() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=\\|';
    const chars = []
    for (let i = 0; i < 25; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        chars.push(characters[randomIndex])
    }
    return Buffer.from(chars.join("")).toString("base64")
}

module.exports = {
    path: "/oauth",
    methods: {
        "get": (req, res) => {
            res.sendFile(path.join(__dirname, "..", "public", "oauth.html"))
        },
        "post": (req, res, global) => {
            if (!req.body.cred) return res.status(400).send({ "error": "No credential provided" })

            const cref = req.body.cred
            const user = JSON.parse(Buffer.from(cref, "base64").toString("utf-8"))
            const email = user.email

            if (!email) return res.status(400).send({ "error": "No email provided in cred" })

            const token = newToken()
            for (const savedToken in global.tokens) {
                if (Object.hasOwnProperty.call(global.tokens, savedToken)) {
                    const savedEmail = global.tokens[savedToken];
                    if (savedEmail == email) delete global.tokens[savedToken]
                }
            }

            global.tokens[token] = email
            try {
                fs.writeFileSync(path.join(__dirname, "..", "auth", email + ".json"), JSON.stringify(user))
                res.send({ "token": token })
            } catch (err) {
                res.status(500).send({ "error": "Error saving used data: " + err })
            }
        }
    }
}