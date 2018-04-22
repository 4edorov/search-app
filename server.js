require('dotenv').config()
const express = require('express')
const debug = require('debug-levels')('server')
const DbConn = require('./server/lib/DbConn')
const https = require('https')

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

  const historyData = {
    query,
    careatedAt: new Date()
  }

  const coll = DbConn.getColl()
  await coll.insert(historyData)

  const searchEngineUri = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CX}&q=${query}&searchType=image&num=${offset}`
  https.get(searchEngineUri, response => {
    let data = ''

    response.on('data', chunk => {
      data += chunk
    })

    response.on('end', () => {
      try {
        const parsedData = JSON.parse(data)
        debug.debug('data', parsedData)
        res.json(parsedData)
      } catch (error) {
        debug.error('ERROR', error)
      }
    })
  }).on('error', error => {
    debug.error('ERROR', error)
  })
})

app.get('/api/latest/imagesearch', async (req, res) => {
  const coll = DbConn.getColl()
  const mongoRes = await coll.find().sort({createdAt: 1}).limit(10)
  const latestQueries = await mongoRes.toArray()
  debug.debug('latestQueries', latestQueries)

  res.json(latestQueries)
})

async function startUp() {
  await DbConn.init()

  app.listen(port, () => debug.info('search-app is on port:', port))
}

startUp()
