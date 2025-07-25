const express = require("express");
const {signUp , signIn, getMe , logout , editProfile} = require('../controllers/auth.controller')
const verifyJwt = require("../middlewares/verifyJwt")


const authRouter = express.Router();




authRouter.route("/signup").post(signUp);
authRouter.route("/signIn").post(signIn);
authRouter.route("/logout").get(logout);
authRouter.route("/me").get(verifyJwt ,getMe);
authRouter.route("/eidt/me").patch(verifyJwt , editProfile);


module.exports = authRouter;