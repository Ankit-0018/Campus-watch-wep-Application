const Issue = require("../models/issue.model")
const uploadImage = require("../utils/uploadImage")
const createIssue = async (req, res) => {
  try {
    const { title, description, location } = req.body;

    // Upload each image to Cloudinary
    const imageUploadPromises = req.files.map((file) =>
      uploadImage(file.path)
    );

    const imageUrls = await Promise.all(imageUploadPromises);

    const issue = await Issue.create({
      title,
      description,
      location,
      imageUrls,
      reportedBy: req.user.id,
    });

    await issue.save()


    res.status(201).json({
      success: true,
      message: "Issue reported",
      issue,
    });

  } catch (error) {
    console.error("Issue creation failed:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find().populate("reportedBy", "fullName email department")
    res.json({ success: true, issues })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}


const toggleUpvote = async (req,res) => {
  try {
    const {id : issueId} = req.params;
    const userId  = req.user.id;
    if(!issueId) return res.status(404).json({
      message : "Issue Not found",
      success : false
    });
    const upvoteIssue = await Issue.findById(issueId);

const hasUpvoted = upvoteIssue.upvotedBy.some(uId => uId.toString() === userId.toString());


    if(hasUpvoted) {
     upvoteIssue.upvotedBy = upvoteIssue.upvotedBy.filter(uId => uId.toString() !== userId.toString());

    }else {
      upvoteIssue.upvotedBy.push(userId)
      
    }
    upvoteIssue.upvotes = upvoteIssue.upvotedBy.length.toString();
    await upvoteIssue.save();
     res.status(200).json({ message: "Upvote toggled", upvotes: upvoteIssue.upvotes , success : true });

  } catch (error) {
     console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

 const commentIssue = async (req,res) => {
  const issueId = req.params.id;
  const comment = req.body.text;
  const userId = req.user.id;
  const issueToComment = await Issue.findById(issueId);
  if(!issueToComment) return res.status(404).json({
    message : "Issue Not found!",
    success : false
  })
issueToComment.comments.push({text : comment , user : userId});
await issueToComment.save()

res.status(200).json({
  message : "Comment Added",
  success : true
})
}


module.exports = {createIssue , getAllIssues , toggleUpvote , commentIssue};