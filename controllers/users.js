// const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  SERVER_ERROR,
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICT,
  UNAUTHORIZED,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

exports.createUser = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;

    // Validate avatar URL
    if (!validator.isURL(avatar)) {
      return res
        .status(BAD_REQUEST)
        .send({ message: "Invalid URL for avatar." });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 8);

    // Create the user with the hashed password
    const newUser = new User({ name, avatar, email, password: hashedPassword });
    await newUser.save();

    // Convert user to object and delete the password before sending
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json(userResponse);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res
        .status(CONFLICT)
        .send({ message: "User with this email already exists." });
    }
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: err.message });
    }
    return res.status(SERVER_ERROR).send({ message: "Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    // Send the token in the response body
    return res.status(200).send({ token });
  } catch (err) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: "Invalid login credentials" });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password"); // Excludes password when fetching

    if (!user) {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }

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

exports.updateCurrentUser = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "avatar"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update),
    );

    if (!isValidOperation) {
      return res.status(BAD_REQUEST).send({ message: "Invalid updates!" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(NOT_FOUND).send({ message: "User not found" });
    }

    updates.forEach((update) => {
      user[update] = req.body[update];
    });
    await user.save({ validateBeforeSave: true });

    return res.status(200).json(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: err.message });
    }
    return res.status(SERVER_ERROR).send({ message: "Internal server error" });
  }
};
