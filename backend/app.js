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

const { Chat } = require("./models/chat");
const { Message } = require("./models/message");

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
// app.post("/api/messages", requireSignIn, sendMessage);
app.get("/api/messages/:chatId", requireSignIn, allMessages);

httpServer.listen(process.env.PORT, () => {
  console.log("server started on port 4000");
});

io.on("connection", (socket) => {
  socket.on("join-user-room", ({ userId }) => {
    console.log(userId);
    socket.join(userId);
    socket.join("general room");
  });

  socket.on("join-chat", (chat) => {
    // console.log(chat._id);
    socket.join(chat._id);
  });

  socket.on("send-message", ({ newMessage: content, chatId, userId }) => {
    try {
      // const { content, chatId } = req.body;

      if (!content || !chatId) {
        throw new Error("Invalid data sent");
      }

      const newMessage = {
        sender: userId,
        content,
        chat: chatId,
      };

      try {
        const message = new Message(newMessage);

        message.save().then(async () => {
          const newMessage = await Message.findById(message._id)
            .populate("sender", "name")
            .populate({
              path: "chat",
              populate: {
                path: "users",
                select: "name email",
              },
            });

          await Chat.findByIdAndUpdate(chatId, {
            latestMessage: newMessage, //update the latest message of that chat anytime we create a new message
          });

          // return res.send(newMessage);
          return io.in(chatId).emit("message-from-server", newMessage);
          // anyone in that room should receive the message
        });
      } catch (error) {
        // return res.status(400).send(error.message);
        console.log(error.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  });

  socket.on("start-typing", ({ chatId, userName, userId }) => {
    console.log(socket.rooms);
    console.log(userId + userName + " is typing...");
    socket
      .to([chatId, userId])
      .emit("start-typing-server", { userName, userId });
  });

  socket.on("typing-stopped", ({ chatId, userName, userId }) => {
    // socket.in(chatId).emit("typing-stopped-server");
    socket
      .to([chatId, userId])
      .emit("typing-stopped-server", { userName, userId });
  });

  socket.on("leave-chat", (chatId) => {
    socket.leave(chatId);
  });

  socket.on("disconnect", () => {
    // console.log("user left chat");
  });
});
