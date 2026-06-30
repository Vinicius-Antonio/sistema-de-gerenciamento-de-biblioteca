import { Sequelize } from 'sequelize'
import databaseConfig from '../config/database.cjs'
import UserModel from './User.js'
import ReaderModel from './Reader.js'
import BookModel from './Book.js'
import LoanModel from './Loan.js'

const env = process.env.NODE_ENV || 'development'
const config = databaseConfig[env]

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
    define: config.define,
  }
)

const User = UserModel(sequelize, Sequelize.DataTypes)
const Reader = ReaderModel(sequelize, Sequelize.DataTypes)
const Book = BookModel(sequelize, Sequelize.DataTypes)
const Loan = LoanModel(sequelize, Sequelize.DataTypes)

const models = {
  User,
  Reader,
  Book,
  Loan,
}

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models)
  }
})

export { sequelize, User, Reader, Book, Loan }
export default models
