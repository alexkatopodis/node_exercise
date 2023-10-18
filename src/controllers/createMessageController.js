const Messages = require('../models/Messages');

const createMessageController = async (req, res) => {
  try {
    const { content, sender, receiver, timestampSent } = req.body;

    if (!content || !sender || !receiver || !timestampSent) {
      return res.status(400).json({ error: 'Missing required parameters.' });
    }

    const lastMessage = await Messages.findOne({
      attributes: ['id'],
      order: [['id', 'DESC']],
    });

    let nextId = 1;

    if (lastMessage) {
      nextId = lastMessage.id + 1;
    }

    const newMessage = await Messages.create({
      id: nextId,
      content,
      sender,
      receiver,
      timestampSent,
      seen: false
    });

    res.status(201).json({ message: 'Message created successfully.', messageData: newMessage });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Error creating message.' });
  }
};

module.exports = createMessageController;
