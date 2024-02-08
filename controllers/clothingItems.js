const validator = require("validator");
const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../middlewares/BadRequestError");
const NotFoundError = require("../middlewares/NotFoundError");
const ForbiddenError = require("../middlewares/ForbiddenError");
const ServerError = require("../middlewares/ServerError");

exports.getAllItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find();
    res.json(items);
  } catch (err) {
    next(new ServerError("Error fetching items"));
  }
};

exports.createItem = async (req, res, next) => {
  try {
    const { name, weather, imageUrl } = req.body;
    if (!validator.isURL(imageUrl)) {
      throw new BadRequestError("Invalid imageUrl format");
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
    if (err.name === "ValidationError") {
      next(new BadRequestError(err.message));
    } else {
      next(new ServerError("Error creating item"));
    }
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const item = await ClothingItem.findById(req.params.id);
    if (!item) {
      throw new NotFoundError("Item not found");
    }

    if (item.owner.toString() !== req.user._id.toString()) {
      throw new ForbiddenError("You are not allowed to delete this item.");
    }

    await item.remove();
    res.json({ message: "Item removed" });
  } catch (err) {
    if (err instanceof NotFoundError) {
      next(err);
    } else if (err.name === "CastError") {
      next(new BadRequestError("Incorrect item ID format"));
    } else {
      next(new ServerError("Error deleting item"));
    }
  }
};

exports.likeItem = async (req, res, next) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!item) {
      throw new NotFoundError("Item not found");
    }
    res.json(item);
  } catch (err) {
    if (err instanceof NotFoundError) {
      next(err);
    } else if (err.name === "CastError") {
      next(new BadRequestError("Invalid item ID format"));
    } else {
      next(new ServerError("Error liking item"));
    }
  }
};

exports.dislikeItem = async (req, res, next) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true, upsert: false },
    );
    if (!item) {
      throw new NotFoundError("Item not found");
    }
    res.json(item);
  } catch (err) {
    if (err instanceof NotFoundError) {
      next(err);
    } else if (err.name === "CastError") {
      next(new BadRequestError("Incorrect item ID format"));
    } else {
      next(new ServerError("Error unliking item"));
    }
  }
};
