const Messages = require('../models/Messages');

const unreadMessagesController = async (req, res) => {
  try {
    const unreadMessages = await Messages.findAll({
      where: {
        seen: false,
      },
    });

    res.status(200).json(unreadMessages);
  } catch (error) {
    console.error('Error fetching unread messages:', error);
    res.status(500).json({ error: 'Error fetching unread messages.' });
  }
};

module.exports = unreadMessagesController;
