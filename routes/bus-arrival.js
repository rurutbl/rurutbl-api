
const axios = require("axios")
module.exports = {
    path: "/bus-arrival",
    methods: {
        "get": async (req, res, global) => {
            const busStopCode = req.query.BusStopCode
            if (!busStopCode) return res.status(400).send({ error: "param `busStopCode` was not set" })

            let _busStopIsCached = Object.prototype.hasOwnProperty.call(global.cache, busStopCode)
            let _isBeforeExpiry = global.cache[busStopCode] ? global.cache[busStopCode].clears_in > new Date().getTime() : false
            if (_busStopIsCached && _isBeforeExpiry) {
                const cachedData = global.cache[busStopCode].data
                res.send(cachedData.Services)
                return
            }

            const headersList = { "AccountKey": process.env.datamall_key }
            const url = `http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${busStopCode}`
            const reqOptions = { url: url, method: "GET", headers: headersList }
            await axios
                .request(reqOptions)
                .then(response => {
                    global.cache[busStopCode] = {
                        data: response.data,
                        clears_in: new Date().getTime() + 30000
                    }
                    res.send(response.data.Services);
                })
                .catch(err => {
                    if (err) {
                        console.log(err.toJSON())
                        res.status(500).send({ error: error.toJSON() })
                    }
                })
        }
    }
}