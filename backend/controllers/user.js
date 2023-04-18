const { User } = require("../models/user");

const allUsers = async (req, res) => {
  const query = req.query.search
    ? {
        $or: [
          // we use this to find a regex match for the "name" or "email" field of the "users" collection
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {
        /**do nothing */
      };
  
  const users = await User.find(query)
    .find({ _id: { $ne: req.user._id } })
    .select("-picture");

  return res.send(users);
};

const getUserImage = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (user.picture.data) {
      res.set("Content-Type", user.picture.contentType);
      return res.send(user.picture.data);
    } else {
      throw new Error("No picture in database");
    }
  } catch (error) {
    return res.json({ error: error.message });
  }
};

module.exports = { allUsers, getUserImage };
