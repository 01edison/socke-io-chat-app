const { Schema, model } = require("mongoose");

const { ObjectId } = Schema.Types;

const messageSchema = new Schema(
  {
    sender: {
      type: ObjectId,
      ref: "User",
    },

    content: { type: String, trim: true },

    chat: {
      type: ObjectId,
      ref: "Chat",
    },
  },
  { timestamps: true }
);


exports.Message = new model("Message", messageSchema)