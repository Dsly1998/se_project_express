const validator = require("validator");
const ClothingItem = require("../models/clothingItem");
const {
  SERVER_ERROR,
  BAD_REQUEST,
  NOT_FOUND,
  FORBIDDEN,
} = require("../utils/errors");

// const INVALID_DATA = "Some error message";  // No longer necessary

exports.getAllItems = async (req, res) => {
  try {
    const items = await ClothingItem.find();
    return res.json(items);
  } catch (err) {
    return res.status(SERVER_ERROR).send({ message: "Error fetching items" });
  }
};

exports.createItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;
    if (!validator.isURL(imageUrl)) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Invalid imageUrl format" });
    }

    const newItem = new ClothingItem({
      name,
      weather,
      imageUrl,
      owner: req.user._id,
    });

    await newItem.save();
    return res.status(201).json(newItem);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: err.message });
    }
    return res.status(SERVER_ERROR).send({ message: "Error creating item" });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await ClothingItem.findById(req.params.itemId);
    if (!item) {
      return res.status(NOT_FOUND).json({ message: "Item not found" });
    }

    // Check if the logged-in user's ID matches the item's owner ID
    if (item.owner.toString() !== req.user._id.toString()) {
      return res
        .status(FORBIDDEN)
        .json({ message: "You are not allowed to delete this item." });
    }

    await item.remove();
    return res.json({ message: "Item removed" });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(BAD_REQUEST)
        .send({ message: "Incorrect item ID format" });
    }
    return res.status(SERVER_ERROR).send({ message: "Error deleting item" });
  }
};

exports.likeItem = async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!item) {
      return res.status(NOT_FOUND).send({ message: "Item not found" });
    }
    return res.json(item);
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(BAD_REQUEST)
        .send({ message: "Invalid item ID format" });
    }
    return res.status(SERVER_ERROR).send({ message: "Error liking item" });
  }
};

exports.dislikeItem = async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true, upsert: false },
    );
    if (!item) {
      return res.status(NOT_FOUND).send({ message: "Item not found" });
    }
    return res.json(item);
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(BAD_REQUEST)
        .send({ message: "Incorrect item ID format" });
    }
    return res.status(SERVER_ERROR).send({ message: "Error unliking item" });
  }
};
