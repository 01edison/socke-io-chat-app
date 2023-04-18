const { Schema, model } = require("mongoose");

//chatName
//isGroupChat
//users
// latestMessage
// groupAdmin

const { ObjectId } = Schema.Types;

const chatSchema = new Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },

    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [{ type: ObjectId, ref: "User" }], //just an array of ID's like [6223435, 62353544]
    latestMessage: {
      type: ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

exports.Chat = new model("Chat", chatSchema);
