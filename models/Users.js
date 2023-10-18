const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const Users = sequelize.define('Users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birthdate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  timestamps: false
});

module.exports = Users;
