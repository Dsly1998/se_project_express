const validator = require("validator"); // Importing the validator library
const ClothingItem = require("../models/clothingitem");
const { SERVER_ERROR } = require("../utils/errors"); // Import the constant from errors.js
const INVALID_DATA = "Some error message";
const NOT_FOUND = "Not found error message";

// Fetches all clothing items
exports.getAllItems = async (req, res) => {
  try {
    const items = await ClothingItem.find();
    res.json(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(SERVER_ERROR).send({ message: "Error fetching items" });
  }
  return;  // Add this
};


// Creates a new clothing item
exports.createItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;

    // Check if the imageUrl is a valid URL
    if (!validator.isURL(imageUrl)) {
      return res
        .status(INVALID_DATA)
        .json({ message: "Invalid imageUrl format" });
    }

    const newItem = new ClothingItem({
      name,
      weather,
      imageUrl,
      owner: req.user._id,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error("Error creating item:", err);
    if (err.name === "ValidationError") {
      return res.status(INVALID_DATA).send({ message: err.message });
    }
    res.status(SERVER_ERROR).send({ message: "Error creating item" });
  }
};

// Deletes a clothing item by its ID
exports.deleteItem = async (req, res) => {
  try {
    const item = await ClothingItem.findById(req.params.itemId);

    // If no item found, return a 404 Not Found response
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await item.remove();
    res.json({ message: "Item removed" });
  } catch (err) {
    console.error("Error deleting item:", err);

    // Check if the error is due to an incorrect ID format
    if (err.name === "CastError") {
      return res.status(400).send({ message: "Incorrect item ID format" });
    }

    res.status(500).send({ message: "Error deleting item" });
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
      return res.status(404).send({ message: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).send({ message: "ID DONT KNOW THW" });
    }
    console.error("Error liking item:", err);
    return res.status(500).send({ message: "Error liking item" });
  }
};

exports.dislikeItem = async (req, res) => {
  try {
    // Using the findByIdAndUpdate method directly, which will also check if the item exists
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.id, // Using the correct parameter name
      { $pull: { likes: req.user._id } },
      { new: true, upsert: false }, // Do not create a new item if it doesn't exist, and return the updated item
    );

    if (!item) {
      return res.status(NOT_FOUND).send({ message: "Item not found" });
    }

    res.json(item);
  } catch (err) {
    console.error("Error unliking item:", err);

    // Check if the error is due to an incorrect ID format
    if (err.name === "CastError") {
      return res
        .status(INVALID_DATA)
        .send({ message: "Incorrect item ID format" });
    }

    res.status(SERVER_ERROR).send({ message: "Error unliking item" });
  }
};
