const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const { database, username, password, host, port, dialect } = require('../configs/config.json')[env];

const sequelize = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: dialect,
});

module.exports = sequelize;
