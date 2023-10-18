const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const Messages = sequelize.define('Messages', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sender: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  receiver: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  seen: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  timestampSent: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  timestamps: false
});

module.exports = Messages;
