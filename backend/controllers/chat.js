const { Chat } = require("../models/chat");
const { User } = require("../models/user");
const { generateRandomString } = require("../utils/generateRandomString");

const createChat = async (req, res) => {
  try {
    const { userId } = req.body; // person you want to chat with

    if (!userId) {
      console.log("No userId sent with request");
      return res.status(400);
    }

    const chatMate = await User.findById(userId);

    let chats = await Chat.find({
      isGroupChat: false,
      $and: [
        //each chat has a "users" array field containing the ids of the 2 people chatting
        //find the chat whose "users" array contains the current user id "req.user._id" and id of person they want to chat with
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "name",
        },
      })
      .populate("latestMessage.sender", "name -picture -password email");

    if (chats.length > 0) {
      res.send(chats[0]);
    } else {
      const newChat = new Chat({
        chatName:
          req.user.name + "-" + chatMate.name + "-" + generateRandomString(6),
        isGroupChat: false,
        users: [req.user._id, userId],
      });
      try {
        newChat.save().then(async () => {
          console.log("New chat created");

          const newFullChat = await Chat.findOne({ _id: newChat._id }).populate(
            "users",
            "-password -picture"
          );
          return res.send(newFullChat);
        });
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const fetchAllChats = async (req, res) => {
  try {
    const { _id } = req.user;

    const chats = await Chat.find({
      users: { $elemMatch: { $eq: _id } },
    })
      .populate("users", "-picture -password")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "name",
        },
      })
      .populate("latestMessage.sender", "name -picture -password email")
      .populate("groupAdmin", "-password -picture")
      .sort({ updatedAt: "DESC" });

    res.send(chats);
  } catch (err) {
    console.log(err);
    return res.send(err.message);
  }
};

module.exports = { createChat, fetchAllChats };
