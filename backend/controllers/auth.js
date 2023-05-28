const formidable = require("formidable");
const { User } = require("../models/user");
const { generateToken } = require("../utils/generateToken");
const bcrypt = require("bcrypt");
const fs = require("fs");

const register = async (req, res) => {
  try {
    let form = new formidable.IncomingForm(); //use the IncomingForm() constructor
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      console.log(fields);
      try {
        if (err) throw err;
        const { name, email, password } = fields;

        if (!name || !email || !password) {
          throw new Error("Please fill all required fields");
        }

        const user = await User.findOne({ email }).exec();
        if (user) {
          throw new Error("User already exists");
        }

        const newUser = new User({
          name,
          email,
          password: bcrypt.hashSync(password, 10),
        });

        if (files) {
          newUser.picture.data = fs.readFileSync(files.image.filepath); // store the picture
          newUser.picture.contentType = files.image.mimetype;
        }
        newUser.save().then(() => res.json({ newUser }));
      } catch (err) {
        console.log(err.message);
        return res.status(400).json({ err: err.message });
      }
    });
  } catch (error) {
    // console.log(error);
    return res.status(400).json({ error });
  }
};

const login = async (req, res) => {
  try {
    let form = new formidable.IncomingForm(); //use the IncomingForm() constructor
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      
      try {
        const { email, password } = fields;
        const user = await User.findOne({ email }).select("-picture").exec();
      
        if (!user) {
          throw new Error("User does not exist");
        }

        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if (!isPasswordCorrect) {
          throw new Error("Password is not correct");
        }
        const token = generateToken(user._id);
        // res.cookie("token", token);

        return res.json({ user, token });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    });
  } catch (err) {
    return res.json({ err: err.message });
  }
};

module.exports = { login, register };
