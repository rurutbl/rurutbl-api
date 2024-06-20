const haversine = require('haversine-distance');
module.exports = {
    path: "/nearby-busstops",
    methods: {
        "get": (req, res, global) => {
            const poi = { "lat": Number(req.query.lat), "lon": Number(req.query.lon) };
            const nearestBusStop = findNearestBusStop(poi, global.totalBusStops);
            res.send(nearestBusStop)
        }
    }
}

const findNearestBusStop = (poi, busStops) => {
    const maxDistance = Infinity
    const maxResults = 45
    const nearbyBusStops = [];

    busStops.forEach(busStop => {
        const busStopCoords = { lat: busStop.Latitude, lon: busStop.Longitude };
        const distance = haversine(poi, busStopCoords);
        if (distance <= maxDistance) nearbyBusStops.push({ busStop, distance });
    });

    nearbyBusStops.sort((a, b) => a.distance - b.distance);
    return nearbyBusStops.slice(0, maxResults).map(item => item.busStop);
};
