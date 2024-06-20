const fs = require("fs")
const path = require("path")
module.exports = {
    path: "/messages",
    methods: {
        "get": async (req, res, { discordClient, discordClientReady }) => {
            if (!discordClientReady) return res.status(503).send({ error: "The Discord bot client is not ready. Please try again later." })
            if (!req.query.cid) return res.status(401).send({ error: "No channel id was sent" })
            if (!discordClient.channels || !discordClient.channels.cache) return res.status(500).send({ error: "Channels cache not accessible" })

            const channel = await discordClient.channels.cache.find(channel => channel.name.toLowerCase() === req.query.cid.toLowerCase())
            if (!channel) return res.status(404).send({ error: `Channel<${req.query.cid}> does not exist` })
            channel.messages.fetch({ limit: 50 })
                .then(messages => { res.send(messages) })
                .catch(err => {
                    console.log(err);
                    res.status(500).send({ error: err })
                })
        },
        "post": async (req, res, { discordClient, discordClientReady, tokens }) => {
            if (!discordClientReady) return res.status(503).send({ error: "The Discord bot client is not ready. Please try again later." })
            if (!req.headers.token) return res.status(401).send({ error: "No token provided" })
            if (!Object.hasOwnProperty.call(tokens, req.headers.token)) return res.status(401).send({ "error": "Token invlaid" })
            if (!req.query.cid) return res.status(400).send({ error: "No channel id provided" })
            if (!req.body) return res.status(400).send({ error: "No body was provided" })

            const token = req.headers.token
            const message = req.body

            const email = tokens[token]
            if (!email) return res.status(401).send({ "error": "Invalid Token" })

            const userPath = path.join(__dirname, "..", "auth", email + ".json")
            if (!fs.existsSync(userPath)) return res.status(500).send({ "error": "Token invlaid: User data not found" })

            const userData = require(userPath)
            message.author = userData.name || "Unknown"

            const channel = await discordClient.channels.cache.find(channel => channel.name.toLowerCase() === req.query.cid.toLowerCase())
            channel.send({ content: Buffer.from(JSON.stringify(req.body)).toString("base64") })
                .then(discordMessage => {
                    res.send(discordMessage)
                })
                .catch(err => {
                    console.log(err);
                    res.send({ error: err })
                })
        }
    }
}