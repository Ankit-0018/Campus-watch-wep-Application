const mongoose = require("mongoose");



const claimedUserSchema = new mongoose.Schema({
   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
   notificationId: { type: mongoose.Schema.Types.ObjectId, ref: "Notification" },
   claimedType : {
    type : String,
    required : true
   }
} , {timestamps : true})


const itemSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String ,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    imageUrls: [
  {
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    }
  }
],

    status : {
        type : String,
        enum : ['Lost' , 'Found'],
        required : true
    },
    isActive : {
        type : Boolean,
        default : true,
        
    },
    reportedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    claimedBy : [claimedUserSchema]

}, {timestamps : true})



const Item = mongoose.model('Item' , itemSchema)

module.exports = Item;