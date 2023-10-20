const Messages = require('../models/Messages');

const unreadMessagesController = async (req, res) => {
  try {
    const { userId } = req.query;

    const unreadMessages = await Messages.findAll({
      where: {
        receiver: userId,
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
