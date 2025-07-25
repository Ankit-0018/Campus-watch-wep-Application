const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")


const signUp = async (req, res) => {


  try {
    const { fullName, email, password, department, role, phone , gender } = req.body;

   
    if (!fullName || !email || !password || !department || !role || !phone ||!gender) {
      return res.status(400).json({ 
        message: 'Please fill all required fields.',
        success : false

       });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
         message: 'User already exists with this email.' ,
        success : false
        
        });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      department,
      role,
      gender,
      phone,
      
    });

    await newUser.save();

    return res.status(201).json({
         message: 'User registered successfully.',
        success : true
        });

  } catch (error) {
    console.error('Signup Error:', error);
    return res.status(500).json({ 
        message: 'Internal Server Error',
    success : false
    });
  }
};



const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

  
    if (!email || !password) {
      return res.status(400).json({
        message: 'All fields are required!',
        success: false,
      });
    }


    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: 'User not found!',
        success: false,
      });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials!',
        success: false,
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '3d' }
    );

    
   res.cookie('token', token, {
  httpOnly: true,
  secure: true,          
  sameSite: 'None',      
  maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
});
    
    return res.status(200).json({
      message: 'Login successful!',
      success: true,
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('SignIn Error:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
      success: false,
    });
  }
};


const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'strict',
    
  });
  res.status(200).json({ message: 'Logged out successfully',
    success : true
  });
};



const getMe = async (req,res) => {

  try {
    
const user = await User.findById(req.user.id).select("-password") .populate({
    path: "notifications",
  
    populate: [
      { path: "item" },
      { path: "fromUser" }
    ],
  });



if(!user){
  return res.status(404).json({
    message : "User not Found!",
    success : false
  })
}


res.json({
  message : "User fetched Successfully!",
  success : true,
  user
})
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }

}


const editProfile = async (req,res) => {
try {
  const userId = req.user.id;
  const {fullName , department , gender} = req.body;
  const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Only update if values are provided
    if (fullName) user.fullName = fullName;
    if (department) user.department = department;
    if (gender) user.gender = gender;

    const updatedUser = await user.save();

    res.json({
      message: "Profile updated successfully",
      updatedUser
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {signUp , signIn , getMe , logout , editProfile};