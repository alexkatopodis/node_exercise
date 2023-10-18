const Users = require('../models/Users');

const getUsersController = async (req, res) => {
  try {
    const { firstName, lastName, gender } = req.query;

    const query = {};

    if (firstName) {
      query.firstName = firstName;
    }

    if (lastName) {
      query.lastName = lastName;
    }

    if (gender) {
      query.gender = gender;
    }

    const users = await Users.findAll({
      where: query,
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users.' });
  }
};

module.exports = getUsersController;
