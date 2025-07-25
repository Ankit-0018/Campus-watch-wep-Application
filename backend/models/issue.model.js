const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);



const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  priority: {
    type: String,
    enum: ["low" , "medium" , "critical"],
    default: "low"
  },
  upvotedBy : {
    type : [mongoose.Schema.Types.ObjectId],
  ref : "User"
  },
  upvotes : String,
  comments : [commentSchema],
  
  imageUrls: [
    
   { url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    }
  }
],
  status: {
    type: String,
    enum: ["pending", "in-progress", "resolved"],
    default: "pending"
  },
  location:{
    type : String,
    required : true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
} , {timestamps : true})

module.exports = mongoose.model("Issue", issueSchema)
