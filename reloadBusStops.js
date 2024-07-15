const path = require("path")
const axios = require("axios")

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