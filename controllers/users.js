const validator = require("validator");
const User = require("../models/user");
const { SERVER_ERROR } = require("../utils/errors");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users); // Ensure we return the response
  } catch (err) {
    return res.status(SERVER_ERROR).send({ message: "Server Error" }); // Ensure we return the response
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user); // Ensure we return the response
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    return res.status(SERVER_ERROR).send({ message: "Server Error" }); // Ensure we return the response
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    if (!name) {
      return res.status(400).send({ message: "Name is required." });
    }
    if (name.length < 2) {
      return res
        .status(400)
        .send({ message: "Name should be at least 2 characters long." });
    }
    if (name.length > 30) {
      return res
        .status(400)
        .send({ message: "Name should be no longer than 30 characters." });
    }
    if (!avatar) {
      return res.status(400).send({ message: "Avatar is required." });
    }
    if (!validator.isURL(avatar)) {
      return res.status(400).send({ message: "Invalid URL for avatar." });
    }

    const newUser = new User({ name, avatar });
    await newUser.save();
    return res.status(201).json(newUser); // Ensure we return the response
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).send({ message: err.message });
    }
    return res.status(SERVER_ERROR).send({ message: "Server Error" }); // Ensure we return the response
  }
};
