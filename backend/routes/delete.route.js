const express = require("express")
const { deleteContent } = require("../controllers/delete.controller")
const deleteRouter = express.Router()

deleteRouter.route("/deleteItem/:type/:id").delete(deleteContent)


module.exports = deleteRouter;