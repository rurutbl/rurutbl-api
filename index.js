const fs = require("fs")
const cors = require('cors')
const http = require('http');
const express = require("express")
const socketIo = require('socket.io');
const bodyParser = require('body-parser')
const { Client, GatewayIntentBits } = require("discord.js")

const totalBusStops = require("./bus_stops.json")
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
    ]
})

require('dotenv').config()

const global = {
    discordClient: client,
    discordClientReady: false,
    totalBusStops: totalBusStops,
    cache: {},
    tokens: {},
    channelsBeingCreated: []
}

const app = express()
const server = http.createServer(app);
const io = socketIo(server)

client.on("ready", () => {
    console.log("Discord Bot is on")
    global.discordClientReady = true
})
server.listen(80, () => {
    console.log("API server is on")
})

app.use(bodyParser.json())
app.use(cors({
    origin: ['http://localhost:3000', "https://rurutbl.luluhoy.tech", 'http://localhost', "https://api.luluhoy.tech"],
    optionsSuccessStatus: 200
}))

client.on("messageCreate", (msg) => {
    io.emit('message-' + msg.channel.name.toLowerCase(), msg);
})

fs.readdir('./routes/', async (err, routes) => {
    if (err) return console.error(err);
    routes.forEach(route => {
        if (!route.endsWith(".js")) return;

        let routeInfo = require(`./routes/${route}`);
        for (const method in routeInfo.methods) {
            const func = routeInfo.methods[method];

            app[method](routeInfo.path, (req, res) => func(req, res, global));
        }
        console.log(routeInfo);
    });
});

client.login(process.env.discord_token)