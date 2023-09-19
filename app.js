const express = require("express");
const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Temporary authorization middleware
app.use((req, res, next) => {
  req.user = {
    _id: "6508a7ecca0067f91261f918", // This is just a placeholder, replace with your actual test user's _id
  };
  next();
});

// Route
app.use(express.json());
app.use("/users", require("./routes/users"));
app.use("/items", require("./routes/clothingItems"));

// Catch-all route handler for non-existent resources
app.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'An error has occurred on the server.';
    res.status(statusCode).json({ message: message });
});


module.exports = app; // This is useful for testing and other imports if needed later.
