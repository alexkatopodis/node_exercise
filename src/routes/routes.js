const express = require('express');
const router = express.Router();

const importDataController = require('../controllers/importDataController');
const createMessageController = require('../controllers/createMessageController');
const updateMessageController = require('../controllers/updateMessageController');
const unreadMessagesController = require('../controllers/unreadMessagesController');
const getUsersController = require('../controllers/getUsersController');
const getMessagesBetweenUsersController = require('../controllers/getMessagesBetweenUsersController');


router.post('/feedDB', importDataController);
router.post('/createMessage', createMessageController);
router.put('/updateMessage/:id', updateMessageController);
router.get('/unreadMessages', unreadMessagesController);
router.get('/getUsers', getUsersController);
router.get('/getMessagesBetweenUsers', getMessagesBetweenUsersController);


module.exports = router;
