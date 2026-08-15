'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

config.host     = process.env.DB_HOST     || config.host;
config.port     = process.env.DB_PORT     || config.port;
config.username = process.env.DB_USER     || config.username;
config.password = process.env.DB_PASSWORD || config.password;
config.database = process.env.DB_NAME     || config.database;
if (process.env.DB_HOST) {
  config.dialectOptions = { ssl: { rejectUnauthorized: false } };
}

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => {
    console.info("Database connection has been established successfully.")
  })
  .catch(() => {
    console.info("Unable to connect with the database.")
  })

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
