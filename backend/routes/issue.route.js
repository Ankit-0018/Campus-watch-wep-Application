const express = require("express");
const multer  = require('multer')
const {createIssue , getAllIssues, toggleUpvote} = require('../controllers/issue.controller.js');
const upload = require("../middlewares/multer");

const issueRouter = express.Router()

issueRouter.post("/",upload.array("images" , 3) , createIssue)
issueRouter.get("/", getAllIssues)
issueRouter.patch("/:id/upvote" , toggleUpvote)

/* issueRouter.get("/:id", getIssueById)


issueRouter.patch("/:id",  updateIssueStatus)


issueRouter.delete("/:id",  deleteIssue) */

module.exports = issueRouter
