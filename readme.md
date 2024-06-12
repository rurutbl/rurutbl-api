# Rurutbl ~ API Server
## Overview
Rurutbl API is a ExpressJS backend of [rurutbl](https://rurutbl.luluhoy.tech/) used for Bus Arrival APIs

Website: https://rurutbl.luluhoy.tech/

Other Rurutbl Repos
* Rurutbl: https://github.com/rurutbl/rurutbl-react
* Scanner: https://github.com/rurutbl/rurutbl-scanner
* Legacy site: https://github.com/rurutbl/rurutbl-static

# Installation

You'll need NodeJS to install Rurutbl API.  Get node.js from here: http://nodejs.org/.

run `npm i` to install all packages

# Running Rurutbl



Run the web server:

```bash
node .
```

Open [http://localhost](http://localhost) with your browser to see the result.


## Requesting for Datamall API
Submit a [request](https://datamall.lta.gov.sg/content/datamall/en/request-for-api.html) to Datamall to receve a key. This key is used for the Bus Arrival API provided by Datamall. Place the key in a `.env` file
```bash
datamall_key="{YOUR+KEY}"
```

replace YOUR+KEY with yout actual key