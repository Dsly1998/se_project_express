const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errors } = require('celebrate'); // Import this only if you are using the 'celebrate' package
const authMiddleware = require("./middlewares/auth");
const errorHandler = require('./middlewares/error-handler');
const routes = require('./routes'); // Make sure this correctly points to your central route file
const { SERVER_ERROR, NOT_FOUND } = require("./utils/errors");

const { PORT = 3001, MONGO_URI = "mongodb://127.0.0.1:27017/wtwr_db" } = process.env;
const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

// our routes
app.use(routes);

// Using the request logger
app.use(requestLogger);
app.use(errorLogger)
app.use(errors());
app.use(errorHandler); 

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Failed to connect to MongoDB", err);
  });

// Routes that don't require authentication
app.use("/items", require("./routes/clothingItems"));
app.use(require("./routes"));

// Apply auth middleware only to the routes that require authentication
app.use(authMiddleware);

// Routes that require authentication
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
app.listen(PORT, () => {});

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

module.exports = app;
