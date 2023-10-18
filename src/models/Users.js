const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const Messages = require('./Messages');

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

Users.hasMany(Messages, { foreignKey: 'sender', as: 'sentMessages' });
Users.hasMany(Messages, { foreignKey: 'receiver', as: 'receivedMessages' });

Messages.belongsTo(Users, { foreignKey: 'sender', as: 'messageSender' });
Messages.belongsTo(Users, { foreignKey: 'receiver', as: 'messageReceiver' });

module.exports = Users;
