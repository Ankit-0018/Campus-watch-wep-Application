const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  notificationType: {
    type: String,
    enum: ['found', 'claim'],
    required: true,
  },


 item : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Item',
    required : true
 },

  isRead: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;