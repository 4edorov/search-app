require('dotenv').config()
const express = require('express')
const debug = require('debug-levels')('server')
const DbConn = require('./server/lib/DbConn')

const app = express()

const port = process.env.PORT || 3000

app.get('/api/imagesearch/*', async (req, res) => {
  const query = req.params['0'].trim()
  const offset = parseInt(req.query.offset, 10) || 10
  debug.debug('query:', query, 'offset:', offset)

  if (!query) {
    debug.error('no query')
    res.json({error: 'there is no query'})
    return
  }
})

async function startUp() {
  await DbConn.init()

  app.listen(port, () => debug.info('search-app is on port:', port))
}

startUp()
