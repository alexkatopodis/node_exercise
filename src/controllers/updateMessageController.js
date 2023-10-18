const Messages = require('../models/Messages');

const updateMessageController = async (req, res) => {
  try {
    const messageId = req.params.id;
    const { content, sender, receiver, timestampSent, seen } = req.body;

    if (!content || !sender || !receiver || !timestampSent || seen === undefined) {
      return res.status(400).json({ error: 'Missing required parameters.' });
    }

    const existingMessage = await Messages.findByPk(messageId);

    if (!existingMessage) {
      return res.status(404).json({ error: 'Message not found.' });
    }

    existingMessage.content = content;
    existingMessage.sender = sender;
    existingMessage.receiver = receiver;
    existingMessage.timestampSent = timestampSent;
    existingMessage.seen = seen;

    await existingMessage.save();

    res.status(200).json({ message: 'Message updated successfully.', messageData: existingMessage });
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'Error updating message.' });
  }
};

module.exports = updateMessageController;
