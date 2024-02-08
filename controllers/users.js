const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const BadRequestError = require("../middlewares/BadRequestError");
const NotFoundError = require("../middlewares/NotFoundError");
const ConflictError = require("../middlewares/ConflictError");
const UnauthorizedError = require("../middlewares/UnauthorizedError");
const ServerError = require("../middlewares/ServerError");
const { JWT_SECRET } = require("../utils/config");

exports.createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;

    if (!validator.isURL(avatar)) {
      throw new BadRequestError("Invalid URL for avatar.");
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = new User({ name, avatar, email, password: hashedPassword });
    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      next(new ConflictError("User with this email already exists."));
    } else if (err.name === "ValidationError") {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(200).send({ token });
  } catch (err) {
    next(new UnauthorizedError("Invalid login credentials"));
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.json(user);
  } catch (err) {
    if (err.kind === "ObjectId") {
      next(new BadRequestError("Invalid user ID format"));
    } else if (err instanceof NotFoundError) {
      next(err);
    } else {
      next(new ServerError("Server Error"));
    }
  }
};

exports.updateCurrentUser = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "avatar"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update),
    );

    if (!isValidOperation) {
      throw new BadRequestError("Invalid updates!");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    updates.forEach((update) => {
      user[update] = req.body[update];
    });
    await user.save();

    res.status(200).json(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new BadRequestError(err.message));
    } else if (err instanceof NotFoundError) {
      next(err);
    } else {
      next(err);
    }
  }
};
