const express = require("express");
const path = require("path");
const authRouter = require("./routes/auth.route");
require("./config/db")
const cookieParser = require('cookie-parser');
const cors = require("cors");
const issueRouter  = require("./routes/issue.route");
const verifyJwt = require("./middlewares/verifyJwt");
const  userRouter = require("./routes/user.route");
const itemRouter = require("./routes/items.route");
const notificationRouter = require("./routes/notify.route");
const deleteRouter = require("./routes/delete.route");
require('dotenv').config();
const app = express();


//middlewares
app.use(cookieParser());
app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}))
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use(express.json())
app.use('/auth' , authRouter)
app.use('/api/issues', verifyJwt , issueRouter)
app.use('/api/users' , verifyJwt ,userRouter)
app.use('/api/items' , verifyJwt , itemRouter)
app.use('/api/notifications' , verifyJwt , notificationRouter)
app.use('/api' , verifyJwt, deleteRouter)

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT , () => {
    console.log("Server is Running!...")
})
