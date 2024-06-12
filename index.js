const fs = require("fs")
const cors = require('cors')
const path = require("path")
const axios = require("axios")
const express = require("express")
const haversine = require('haversine-distance');
const totalBusStops = require("./bus_stops.json")
require('dotenv').config()

const app = express()
app.listen(80, () => console.log("ready! http://localhost"))
app.use(cors())
app.get("/nearby-busstops", (req, res) => {
    const poi = { "lat": Number(req.query.lat), "lon": Number(req.query.lon) };
    const nearestBusStop = findNearestBusStop(poi, totalBusStops);
    res.send(nearestBusStop)
})

app.get("/search-busstops", (req, res) => {
    const q = req.query.q
    res.send(
        totalBusStops.filter(bs =>
            bs.BusStopCode.startsWith(q) ||
            bs.Description.toLowerCase().includes(q.toLowerCase())
        )
            .toSpliced(45)
    )
})

app.get("/bus-arrival", async (req, res) => {
    const busStopCode = req.query.BusStopCode

    const headersList = { "AccountKey": process.env.datamall_key }
    const url = `http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${busStopCode}`
    const reqOptions = { url: url, method: "GET", headers: headersList }
    const response = await axios.request(reqOptions);

    res.send(response.data.Services);
    
})
const findNearestBusStop = (poi, busStops) => {
    const maxDistance = Infinity
    const maxResults = 45
    const nearbyBusStops = [];

    busStops.forEach(busStop => {
        const busStopCoords = {
            lat: busStop.Latitude,
            lon: busStop.Longitude
        };

        const distance = haversine(poi, busStopCoords);

        if (distance <= maxDistance) {
            nearbyBusStops.push({ busStop, distance });
        }
    });

    // Sort the nearby bus stops by distance
    nearbyBusStops.sort((a, b) => a.distance - b.distance);

    // Return the nearest 45 bus stops
    return nearbyBusStops.slice(0, maxResults).map(item => item.busStop);
};

function reloadBusStops(){
    var busStops = []

    call()
    async function call(page = 0) {
        const headersList = { "AccountKey": process.env.datamall_key }
        const url = `http://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${page * 500}`
        const reqOptions = { url: url, method: "GET", headers: headersList }
        const response = await axios.request(reqOptions);
        const resLength = response.data.value.length

        console.log(url);
        busStops = busStops.concat(response.data.value)

        if (resLength == 500) return call(page + 1)
        console.log("finished");
        fs.writeFileSync(path.join(__dirname, "bus_stops.json"), JSON.stringify(busStops))
    }
}