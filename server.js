const express = require('express')
const debug = require('debug-levels')('server')

const app = express()

const port = process.env.PORT || 3000

async function startUp() {
  app.listen(port, () => debug.info('search-app is on port:', port))
}

startUp()
