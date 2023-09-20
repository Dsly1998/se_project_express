const validator = require('validator');
const User = require('../models/user');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).send({ message: "Server Error" });
  }
};

exports.getUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return res.status(400).json({ message: "Invalid user ID format" });
      }
      res.status(500).send({ message: "Server Error" });
    }
  };
  
  


exports.createUser = async (req, res) => {
    try {
        const { name, avatar } = req.body;

        // Validate the presence of the name
        if (!name) {
            return res.status(400).send({ message: 'Name is required.' });
        }

        // Validate the name length
        if (name.length < 2) {
            return res.status(400).send({ message: 'Name should be at least 2 characters long.' });
        }

        if (name.length > 30) {
            return res.status(400).send({ message: 'Name should be no longer than 30 characters.' });
        }

        // Validate the presence of the avatar
        if (!avatar) {
            return res.status(400).send({ message: 'Avatar is required.' });
        }

        // Validate that the avatar is a valid URL
        if (!validator.isURL(avatar)) {
            return res.status(400).send({ message: 'Invalid URL for avatar.' });
        }

        const newUser = new User({ name, avatar });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).send({ message: 'Server Error' });
    }
};