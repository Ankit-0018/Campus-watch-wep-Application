const User = require("../models/user.model")
const Notification = require("../models/notify.model")



const readNotification =  async (req, res) => {
  try {
    const notificationId = req.params.id;

    const updated = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Notification not found' });
    }

   return res.json({ 
  success: true, 
  message: 'Marked as read', 
  updatedNotificationId: updated._id 
});
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const readAllNotification = async (req, res) => {

  try {
    console.log("readAllNotification called with user:", req.user)

const findUser = await User.findById(req.user.id);

   const userNotifications = findUser.notifications;


    if (!userNotifications || userNotifications.length === 0) {
      return res.json({ message: "No notifications to update" });
    }

    const result = await Notification.updateMany(
      { _id: { $in: userNotifications }, isRead: false },
      { isRead: true }
    );

console.log("Modified count:", result.modifiedCount);
res.json({ 
  success: true, 
  message: "All marked as read", 
  updatedCount: result.modifiedCount 
});
console.log("Notification update result:", result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports  = {readAllNotification , readNotification}