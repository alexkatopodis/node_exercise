const express = require('express');
const router = express.Router();
const readXlsxFile = require('read-excel-file/node');
const Users = require('../models/Users');
const Messages = require('../models/Messages');
const path = require('path');

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


    await Users.bulkCreate(usersWithBirthdate);

    await Messages.bulkCreate(messagesToInsert);


    res.status(200).json({ message: 'Success imported.' });
  } catch (error) {

    console.error('Error Import:', error);
    res.status(500).json({ error: 'Error Import.' });
  }
});

module.exports = router;