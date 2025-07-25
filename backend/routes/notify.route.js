const express = require("express");
const { readNotification , readAllNotification } = require("../controllers/notify.controller");
const notificationRouter = express.Router()

notificationRouter.patch('/mark-read/:id' , readNotification);
notificationRouter.patch('/mark-all-read' , readAllNotification);


module.exports = notificationRouter