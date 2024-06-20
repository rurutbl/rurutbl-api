const { ChannelType } = require("discord.js")


module.exports = {
    path: "/channel",
    methods: {
        "put": async (req, res, { discordClient, discordClientReady, channelsBeingCreated }) => {
            if (!discordClientReady) return res.status(503).send({ error: "The Discord bot client is not ready. Please try again later." })

            const channelId = req.query.cid
            if (!channelId) return res.status(400).send({ error: "The channel id was not set" })

            const channelsCreating = channelsBeingCreated.includes(channelId)
            if (channelsCreating) return res.status(400).send({ error: "the channel is currently being created" })

            const channel = await discordClient.channels.cache.find(channel => channel.name.toLowerCase() === req.query.cid.toLowerCase())
            if (channel) return res.status(400).send({ error: `Channel<${channelId}> already exists` })

            channelsBeingCreated.push(channelId)

            const guild = await discordClient.guilds.cache.get("1252156880290185217")
            await guild.channels
                .create({
                    name: channelId,
                    type: ChannelType.GuildText,
                })
                .then(newChannel => {
                    res.status(201).send(newChannel)
                    delete channelsBeingCreated[channelId]
                })
                .catch((err) => {
                    console.log(err)
                    res.status(500).send({ error: "Error while creating channel: " + err })
                    delete channelsBeingCreated[channelId]
                    return
                })

        }
    }
}