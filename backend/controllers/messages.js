const { Message } = require("../models/message");
const { Chat } = require("../models/chat");

const sendMessage = async ({ newMessage: content, chatId }) => {
  try {
    // const { content, chatId } = req.body;

    if (!content || !chatId) {
      throw new Error("Invalid data sent");
    }

    const newMessage = {
      sender: req.user._id,
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

      });
    } catch (error) {
      return res.status(400).send(error.message);
    }
  } catch (error) {
    return res.send(error.message);
  }
};

const allMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const allMessages = await Message.find({ chat: chatId })
      .populate("sender", "name email")
      .populate("chat");

    res.send(allMessages);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

module.exports = { sendMessage, allMessages };
