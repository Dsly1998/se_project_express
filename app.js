const express = require("express");
const mongoose = require("mongoose");
const { NOT_FOUND, SERVER_ERROR } = require("./utils/errors");
const authMiddleware = require('./middlewares/auth');  // Import the authorization middleware
const cors = require("cors");

const { PORT = 3001 } = process.env;
const app = express();

app.use(cors());
// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Routes
app.use("/items", require("./routes/clothingItems"));

// Centralized routes which include /signin and /signup
app.use(require('./routes'));

// Apply auth middleware for the routes that require authentication
app.use(authMiddleware);

// Other routes that require authentication
app.use("/users", require("./routes/users"));

// Catch-all route handler for non-existent resources
app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

// Error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || SERVER_ERROR;
  const message = error.message || "An error has occurred on the server.";
  res.status(statusCode).json({ message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
