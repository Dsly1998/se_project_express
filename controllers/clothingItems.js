const ClothingItem = require("../models/clothingitem");
const validator = require("validator"); // Importing the validator library
const { INVALID_DATA, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

// Fetches all clothing items
exports.getAllItems = async (req, res) => {
  try {
    const items = await ClothingItem.find();
    res.json(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(SERVER_ERROR).send({ message: "Error fetching items" });
  }
};

// Creates a new clothing item
exports.createItem = async (req, res) => {
  console.log(req.user._id);

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
    console.log(err.name);
    if (err.name === "CastError") {
      return res.status(400).send({ message: "ID DONT KNOW THW" });
    }
    console.error("Error liking item:", err);
    return res.status(500).send({ message: "Error liking item" });
  }
};

exports.dislikeItem = async (req, res) => {
  try {
    console.log(req.params);
    const item = await ClothingItem.findById(req.params.id);
    if (!item) {
      return res.status(404).send({ message: "Item not found" });
    }

    await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    res.json(item);
  } catch (err) {
    console.error("Error unliking item:", err);

    // Check if the error is due to an incorrect ID format
    if (err.name === "CastError") {
      return res.status(400).send({ message: "Incorrect item ID format" });
    }

    res.status(500).send({ message: "Error unliking item" });
  }
};
