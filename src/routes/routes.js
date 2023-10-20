const express = require("express");
const upload = require('./utils/multerConfig');
const router = express.Router();
const {
  importDataController,
  createMessageController,
  updateMessageController,
  unreadMessagesController,
  getUsersController,
  getMessagesBetweenUsersController,
  getUsersSortedByRecentMessageController
} = require("../controllers");

router.post("/feedDB", upload.single('xlsxFile'), importDataController);
router.post("/createMessage", createMessageController);
router.put("/updateMessage/:id", updateMessageController);
router.get("/unreadMessages", unreadMessagesController);
router.get("/getUsers", getUsersController);
router.get("/getMessagesBetweenUsers", getMessagesBetweenUsersController);
router.get('/getUsersSortedByRecentMessage', getUsersSortedByRecentMessageController);

module.exports = router;
