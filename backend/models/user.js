const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    picture: {
      data: Buffer,
      contentType: String,
    },
    isAdmin: { type: Boolean },
  },
  { timestamps: true }
);

exports.User = new model("User", userSchema);
