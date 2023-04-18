const { Chat } = require("../models/chat");

const createGroupChat = async (req, res) => {
  try {
    const { users, name: chatName } = req.body;
    if (!chatName) {
      throw new Error("Please fill all required fields");
    }
    if (users.length < 2) {
      throw new Error("More than 2 users required for a groupChat");
    }
    if (users.includes(req.user._id)) {
      throw new Error("Admin cannot be part of the list");
    }

    const usersArr = JSON.parse(users);

    usersArr.push(req.user);

    try {
      const groupChat = new Chat({
        chatName,
        isGroupChat: true,
        users: usersArr,
        groupAdmin: req.user._id,
      });

      groupChat.save().then(async () => {
        const fullGroupChat = await Chat.findOne({
          _id: groupChat._id,
        })
          .populate("users", "-picture -password")
          .populate("groupAdmin", "-picture -password");

        return res.send(fullGroupChat);
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ err: err.message });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

const renameGroupChat = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    const groupChat = await Chat.findOne({ _id: chatId });

    if (groupChat.users.includes(req.user._id)) {
      try {
        const updatedGroupChat = await Chat.findOneAndUpdate(
          { _id: chatId },
          { chatName },
          { new: true }
        );
        return res.send(updatedGroupChat);
      } catch (err) {
        return res.status(400).json({ err });
      }
    } else {
      throw new Error("Not group member. Cannot change group name");
    }
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

const addToGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const groupChat = await Chat.findOne({ _id: chatId });

    if (groupChat.isGroupChat) {
      if (!groupChat.users.includes(userId)) {
        const updatedGroupChat = await Chat.findOneAndUpdate(
          { _id: chatId },
          { $push: { users: userId } },
          { new: true }
        )
          .populate("users", "-picture -password")
          .populate("groupAdmin", "-picture -password");
        return res.send(updatedGroupChat);
      } else {
        throw new Error("User already in the group chat.");
      }
    } else {
      throw new Error("This is not a group chat");
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const removeFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const groupChat = await Chat.findOne({ _id: chatId });

    if (groupChat.isGroupChat) {
      if (groupChat.users.includes(userId)) {
        const updatedGroupChat = await Chat.findOneAndUpdate(
          { _id: chatId },
          { $pull: { users: userId } },
          { new: true }
        )
          .populate("users", "-picture -password")
          .populate("groupAdmin", "-picture -password");
        return res.send(updatedGroupChat);
      } else {
        throw new Error("User not in the group chat.");
      }
    } else {
      throw new Error("This is not a group chat");
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
module.exports = {
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
};
