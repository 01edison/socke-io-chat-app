const { User } = require("../models/user");
const { verify } = require("jsonwebtoken");

exports.requireSignIn = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization; //check the headers for the authorization property

    if (!authorization) {
      throw new Error("Not authenticated. Please log in");
    }

    const token = authorization.split(" ")[1]; //strip the token from the authorization property

    const { id } = verify(token, process.env.SECRET); //verify who the user is and get the id

    const foundUser = await User.findById(id).select("-password -picture").exec();
    if (foundUser) {
      req.user = foundUser;
      next();
    } else {
      throw new Error("User does not exist");
    }
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};
