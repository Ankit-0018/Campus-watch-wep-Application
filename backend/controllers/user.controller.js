const User = require("../models/user.model")
 const getAllUsers = async (req,res) => {
  try {

    const users= await User.find().select("-password");



    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};


module.exports = {getAllUsers}