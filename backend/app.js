const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const { createServer } = require("http");
const { Server } = require("socket.io");

mongoose.connect("mongodb://localhost:27017/edison-chat-app").then(() => {
  console.log("database connection established");
});

const { requireSignIn } = require("./middlewares/auth");
const { login, register } = require("./controllers/auth");
const { allUsers, getUserImage } = require("./controllers/user");
const { createChat, fetchAllChats } = require("./controllers/chat");
const {
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
} = require("./controllers/groupChat");
const { sendMessage, allMessages } = require("./controllers/messages");

require("dotenv").config();

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    allowedHeaders: ["Access-Control-Allow-Origin"],
  },
  pingTimeout: 60000,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//auth
app.post("/api/login", login);
app.post("/api/register", register);

//user
app.get("/api/user", requireSignIn, allUsers);
app.get("/api/user/image/:id", getUserImage);

//chat
app
  .route("/api/chat")
  .post(requireSignIn, createChat)
  .get(requireSignIn, fetchAllChats);

//gropChat
app
  .route("/api/group")
  .post(requireSignIn, createGroupChat)
  .put(requireSignIn, addToGroup)
  .patch(requireSignIn, renameGroupChat);

app.post("/api/group/remove", requireSignIn, removeFromGroup);

// messages
app.post("/api/messages", requireSignIn, sendMessage);
app.get("/api/messages/:chatId", requireSignIn, allMessages);

httpServer.listen(process.env.PORT, () => {
  console.log("server started on port 4000");
});

io.on("connection", (socket) => {
  socket.on("join-room", (chat) => {
    // console.log(chat._id);
    socket.join(chat._id);
  });

  socket.on("send-message", ({ newMessage, chatId }) => {
    io.in(chatId).emit("message-from-server", newMessage);
  });
});
