module.exports = {
    path: "/search-busstops",
    methods: {
        "get": (req, res, global) => {
            const q = req.query.q
            res.send(
                global.totalBusStops
                    .filter(bs =>
                        bs.BusStopCode.startsWith(q) ||
                        bs.Description.toLowerCase().includes(q.toLowerCase())
                    )
                    .toSpliced(45)
            )
        }
    }
}