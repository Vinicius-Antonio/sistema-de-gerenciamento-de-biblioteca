const dotenv = require('dotenv')
const fs = require('fs')

dotenv.config()

const isDocker = fs.existsSync('/.dockerenv')

const host = process.env.DB_HOST === 'db' && !isDocker ? 'localhost' : (process.env.DB_HOST || 'localhost')
const port = parseInt(process.env.DB_PORT || '5432', 10)

const dbConfig = {
  username: process.env.DB_USER || 'biblioteca_user',
  password: process.env.DB_PASSWORD || 'biblioteca_pass',
  database: process.env.DB_NAME || 'biblioteca',
  host: host,
  port: port,
  dialect: 'postgres',
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
}

module.exports = {
  development: dbConfig,
  test: dbConfig,
  production: dbConfig,
}
