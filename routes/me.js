const { existsSync } = require("fs")
const path = require("path")

module.exports = {
    path: "/me",
    methods: {
        "get": (req, res, global) => {
            if (!req.headers.token) return res.status(401).send({ error: "No token provided" })
            if (!Object.hasOwnProperty.call(global.tokens, req.headers.token)) return res.status(401).send({ "error": "Invalid Token" })

            const token = req.headers.token

            if (!Object.keys(global.tokens).includes(token)) return res.status(401).send({ "error": "Invalid Token" }) // Unlikely but i'd rather be safe then have a child
            const email = global.tokens[token]

            const userFilePath = path.join(__dirname, "..", "auth", email + ".json")
            if (!existsSync(userFilePath)) return res.status(401).send({ "error": "Invalid Token" })
            res.sendFile(userFilePath)
        },
    }
}