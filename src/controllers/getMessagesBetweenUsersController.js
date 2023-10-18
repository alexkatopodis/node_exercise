const Messages = require('../models/Messages');
const Users = require('../models/Users');
const { Op } = require('sequelize');

const getMessagesBetweenUsersController = async (req, res) => {
  try {
    const { userId1, userId2 } = req.query;

    if (!userId1 || !userId2) {
      return res.status(400).json({ error: 'Missing user IDs.' });
    }

    const user1 = await Users.findByPk(userId1);
    const user2 = await Users.findByPk(userId2);

    if (!user1 || !user2) {
      return res.status(404).json({ error: 'One or both users not found.' });
    }

    const messages = await Messages.findAll({
      where: {
        [Op.or]: [
          {
            sender: userId1,
            receiver: userId2,
          },
          {
            sender: userId2,
            receiver: userId1,
          },
        ],
      },
      order: [['timestampSent', 'DESC']],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages between users:', error);
    res.status(500).json({ error: 'Error fetching messages between users.' });
  }
};

module.exports = getMessagesBetweenUsersController;
