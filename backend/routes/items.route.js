const express = require("express")
const itemRouter = express.Router();
const upload = require("../middlewares/multer")
const {createItem , getAllReportedItems, claimItem} = require("../controllers/item.controller")

itemRouter.route("/").post(upload.array("images" , 3), createItem);
itemRouter.route("/").get(getAllReportedItems);
itemRouter.route("/claimItem/:id/:claimedType").patch(claimItem);


module.exports = itemRouter;