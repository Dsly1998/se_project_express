// controllers/usersController.js
exports.createUser = (req, res) => {
    // logic for creating a user
};
const User = require('../models/user');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).send({ message: 'Server Error' });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).send({ message: 'Server Error' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { name, avatar } = req.body;
        const newUser = new User({ name, avatar });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).send({ message: 'Server Error' });
    }
};
