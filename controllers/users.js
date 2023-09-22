const validator = require("validator");
const User = require("../models/user");
const { SERVER_ERROR, BAD_REQUEST, NOT_FOUND } = require("../utils/errors");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (err) {
    return res.status(SERVER_ERROR).send({ message: "Server Error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(NOT_FOUND).json({ message: "User not found" });
    return res.json(user);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Invalid user ID format" });
    }
    return res.status(SERVER_ERROR).send({ message: "Server Error" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    if (!validator.isURL(avatar)) {
      return res
        .status(BAD_REQUEST)
        .send({ message: "Invalid URL for avatar." });
    }

    const newUser = new User({ name, avatar });
    await newUser.save();
    return res.status(201).json(newUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: err.message });
    }
    return res.status(SERVER_ERROR).send({ message: "Server Error" });
  }
};
