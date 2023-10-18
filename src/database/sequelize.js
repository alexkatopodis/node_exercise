const Sequelize = require('sequelize');

const sequelize = new Sequelize('pccw_db', 'pccw_user', 'pccw_password', {
  host: 'localhost',
  port: 5433,
  dialect: 'postgres',
});


module.exports = sequelize;
