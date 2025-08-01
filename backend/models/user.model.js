const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    fullName : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    
  password: {
    type: String,
    required: true,
  },
   role: {
    type: String,
    enum: ['student', 'faculty', 'admin'],
    default: 'student',
  },

  gender :{
    type : String,
    enum : ['Male' , 'Female'],
    required : true
  },

  profileImage : {
    type : String
  },
  
  department : {
    type : String , 
    required : true
  },
  
  phone  : {
    type : String,
    required : true,
    unique : true
  },
notifications : [ {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Notification"
  }]
  
}, {timestamps: true});


const User = mongoose.model('User' , userSchema);

module.exports = User;