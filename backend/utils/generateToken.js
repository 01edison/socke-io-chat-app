const { sign, verify } = require("jsonwebtoken");

const generateToken = (id) => {
  return sign({ id }, process.env.SECRET);
};

module.exports = { generateToken };
