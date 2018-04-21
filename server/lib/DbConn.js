const MongoClient = require('mongodb').MongoClient
const debug = require('debug-levels')('DbConn')

const dbName = 'development'
const collName = 'search'
const env = process.env.NODE_ENV

const getMongoUri = () => {
  let env = process.env.NODE_ENV
  if (env === 'development') {
    return 'mongodb://localhost:27017'
  }
  if (env === 'production') {
    return `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds245218.mlab.com:45218/${dbName}`
  }
}

const DbConn = {
  conn: null,
  mongoUri: getMongoUri(),
  init: async function() {
    if (DbConn.conn) {
      return DbConn.conn
    }
    const dataBase = await MongoClient.connect(DbConn.mongoUri)
    DbConn.conn = dataBase.db(dbName)

    return DbConn.conn
  },
  getColl: () => {
    return DbConn.conn.collection(collName)
  }
}

module.exports = DbConn
