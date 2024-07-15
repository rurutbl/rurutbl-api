const fs = require("fs");
const cors = require("cors");
const express = require("express");
const totalBusStops = require("./bus_stops.json");
require("dotenv").config();

const global = { totalBusStops: totalBusStops, cache: {} };

const app = express();

app.listen(80, () => {
	console.log("API server is on");
});
app.use(
	cors({
		origin: [
			"http://localhost:3000",
			"https://rurutbl.luluhoy.tech",
			"http://localhost",
			"https://api.luluhoy.tech",
		],
		optionsSuccessStatus: 200,
	})
);

fs.readdir("./routes/", async (err, routes) => {
	if (err) return console.error(err);
	routes.forEach((route) => {
		if (!route.endsWith(".js")) return;

		let routeInfo = require(`./routes/${route}`);
		for (const method in routeInfo.methods) {
			const func = routeInfo.methods[method];

			app[method](routeInfo.path, (req, res) => func(req, res, global));
		}
		console.log(routeInfo);
	});
});
