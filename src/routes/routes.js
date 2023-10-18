const express = require('express');
const router = express.Router();
const readXlsxFile = require('read-excel-file/node');
const Users = require('../models/Users');
const Messages = require('../models/Messages');
const path = require('path');
const { Op } = require('sequelize');

router.post('/feedDB', async (req, res) => {
  try {
    const filePath = path.resolve(__dirname, 'data/seeds.xlsx');
    const usersData = await readXlsxFile(filePath, { sheet: 'users' });
    const messagesData = await readXlsxFile(filePath, { sheet: 'messages' });

    const usersWithBirthdate = usersData.map((row) => {
      const id = row[0];
      return {
        id,
        firstName: row[1],
        lastName: row[2],
        birthdate: row[3],
        gender: row[4],
        username: row[5],
      };
    });

    const messagesToInsert = messagesData.map((row) => {
      const id = row[0];
      return {
        id,
        content: row[1],
        sender: row[2],
        receiver: row[3],
        seen: row[4],
        timestampSent: row[5],
      };
    });

    const existingUserIds = await Users.findAll({
      attributes: ['id'],
      where: {
        id: usersWithBirthdate.map((user) => user.id),
      },
    });

    const existingUserIdsSet = new Set(existingUserIds.map((user) => user.id));

    const usersToInsert = usersWithBirthdate.filter((user) => !existingUserIdsSet.has(user.id));

    const existingMessageIds = await Messages.findAll({
      attributes: ['id'],
      where: {
        id: messagesToInsert.map((message) => message.id),
      },
    });

    const existingMessageIdsSet = new Set(existingMessageIds.map((message) => message.id));

    const messagesToInsertFiltered = messagesToInsert.filter(
      (message) => !existingMessageIdsSet.has(message.id)
    );

    await Users.bulkCreate(usersToInsert);
    await Messages.bulkCreate(messagesToInsertFiltered);

    res.status(200).json({ message: 'Success imported.' });
  } catch (error) {
    console.error('Error Import:', error);
    res.status(500).json({ error: 'Error Import.' });
  }
});


router.post('/createMessage', async (req, res) => {
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
});


router.put('/updateMessage/:id', async (req, res) => {
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
});

router.get('/unreadMessages', async (req, res) => {
  try {
    const unreadMessages = await Messages.findAll({
      where: {
        seen: false
      }
    });

    res.status(200).json(unreadMessages);
  } catch (error) {
    console.error('Error fetching unread messages:', error);
    res.status(500).json({ error: 'Error fetching unread messages.' });
  }
});

router.get('/getUsers', async (req, res) => {
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
      where: query
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users.' });
  }
});


router.get('/getMessagesBetweenUsers', async (req, res) => {
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
});

module.exports = router;
