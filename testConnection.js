const sequelize = require('./database/sequelize');

sequelize
  .authenticate()
  .then(() => {
    console.log('Connected.');
  })
  .catch((error) => {
    console.error('Error to connected', error);
  });
