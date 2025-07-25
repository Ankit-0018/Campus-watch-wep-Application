const cloudinary = require("../config/cloudinary")
const Notification = require("../models/notify.model")
const Issue = require("../models/issue.model")
const Item = require("../models/items.model")



const deleteContent = async (req, res) => {
  const { type, id } = req.params;
  const userId = req.user.id;
  console.log(type)
  console.log(userId)

  const Model = type === "issue" ? Issue : Item
  if (!Model) return res.status(400).json({ message: "Invalid type" });

  const doc = await Model.findById(id);
  console.log(doc)
  if (!doc) return res.status(404).json({ message: `${type} not found` });

  if (doc.reportedBy._id.toString() !== userId.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (Array.isArray(doc.imageUrls)) {
    for (const img of doc.imageUrls) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }
  }

  // ✅ Delete related notifications
  if(Model !== "Issue"){

      await Notification.deleteMany({ item: id }); 
  }

  // ✅ Delete the post itself
  await Model.findByIdAndDelete(id);

  res.status(200).json({ message: `${type} and all images/notifications deleted` });
};


module.exports = {deleteContent}