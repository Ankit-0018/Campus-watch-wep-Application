const Item = require("../models/items.model")
const uploadImage = require('../utils/uploadImage')
const User = require("../models/user.model")
const Notification = require("../models/notify.model")

const createItem = async (req,res) => {

try {
  const {title , description , location , status} = req.body;
    if(!title || !description || !location || !status){
        return res.status(400).json({ 
            message: 'Please fill all required fields.',
            success : false
    
           });
    
    }
    
    
    const imageUploadPromises = req.files.map((file) =>
        uploadImage(file.path)
    );
    
    const imageUrls = await Promise.all(imageUploadPromises);
    
    const item = await Item.create({
        title ,
        description , 
        location ,
        imageUrls,
        status,
        reportedBy : req.user.id,
    
    })
    

res.status(201).json({
    message : "Item Reported Successfully!",
    success : true,
    item
})

} catch (error) {
     console.error("Item Reporting failed:", error);
    res.status(500).json({ success: false, message: error.message });
  
}

}


const getAllReportedItems = async (req, res) => {
  try {
    const reportedItems = await Item.find()
      .populate("reportedBy", "fullName email department phone")
      .populate("claimedBy.user", "fullName email department phone"); 

    res.json({
      success: true,
      reportedItems,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const claimItem = async (req, res) => {
  try {
    const { id: itemId, claimedType } = req.params;
    const userId = req.user.id;

    if (!itemId) {
      return res.status(400).json({
        message: "Item ID is required",
        success: false,
      });
    }

    const item = await Item.findById(itemId).populate("reportedBy");

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
        success: false,
      });
    }

    const existingClaimIndex = item.claimedBy.findIndex(
      (entry) => entry.user.toString() === userId
    );

    if (existingClaimIndex !== -1) {
      const removedClaim = item.claimedBy.splice(existingClaimIndex, 1)[0];

      // Delete the exact notification using stored ID
      if (removedClaim.notificationId) {
        await Notification.findByIdAndDelete(removedClaim.notificationId);

        // Remove notification from the reported user's array
        await User.findByIdAndUpdate(item.reportedBy._id, {
          $pull: { notifications: removedClaim.notificationId },
        });
      }

      await item.save();

      return res.status(200).json({
        message: "Claim removed",
        success: true,
      });

    } else {
      // Create a new notification
      const notification = await Notification.create({
        fromUser: userId,
        item: itemId,
        notificationType: item.status === "Lost" ? "found" : "claim",
        isRead: false,
        createdAt: new Date(),
      });

      // Add notification to reported user's notifications array
      await User.findByIdAndUpdate(item.reportedBy._id, {
        $push: { notifications: notification._id },
      });

      // Push claim with notification ID
      item.claimedBy.push({
        user: userId,
        claimedType,
        notificationId: notification._id,
      });

      await item.save();

      return res.status(200).json({
        message: "Item claimed",
        success: true,
      });
    }
  } catch (error) {
    console.error("Error in claimItem:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};


module.exports = {createItem , getAllReportedItems , claimItem}