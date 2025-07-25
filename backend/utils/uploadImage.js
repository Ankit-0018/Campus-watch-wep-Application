const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const uploadImage = async (localpath) => {
  try {
    const result = await cloudinary.uploader.upload(localpath, {
      resource_type: "image",
    });

    // Always clean up the local file
    if (fs.existsSync(localpath)) {
      fs.unlinkSync(localpath);
    }

    return {
      url : result.secure_url,
      public_id : result.public_id
    };
  } catch (error) {
    // Clean up even on failure
    if (fs.existsSync(localpath)) {
      fs.unlinkSync(localpath);
    }

    console.error("Upload failed:", error.message);
    throw error; // let the caller know the upload failed
  }
};

module.exports = uploadImage;
