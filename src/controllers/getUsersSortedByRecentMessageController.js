const { Op, Sequelize } = require('sequelize');
const Users = require('../models/Users');
const Messages = require('../models/Messages');

async function getUsersSortedByRecentMessage(req, res) {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing user ID.' });
    }

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID.' });
    }

    const user = await Users.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const usersWithRecentMessages = await Users.findAll({
      attributes: ['id', 'firstName', 'lastName', 'birthdate', 'gender', 'username'],
      where: {
        [Op.not]: {
          id: userId,
        },
      },
      include: [
        {
          model: Messages,
          as: 'sentMessages',
          where: {
            sender: {
              [Op.eq]: Sequelize.col('Users.id'),
            },
          },
        },
        {
          model: Messages,
          as: 'receivedMessages',
          where: {
            receiver: {
              [Op.eq]: Sequelize.col('Users.id'),
            },
          },
        },
      ],
      order: [
        [
          { model: Messages, as: 'sentMessages' },
          'timestampSent',
          'DESC',
        ],
        [
          { model: Messages, as: 'receivedMessages' },
          'timestampSent',
          'DESC',
        ],
      ],
    });

    res.status(200).json(usersWithRecentMessages);
  } catch (error) {
    console.error('Error fetching users sorted by recent message:', error);
    res.status(500).json({ error: 'Error fetching users sorted by recent message.' });
  }
}

module.exports = getUsersSortedByRecentMessage;