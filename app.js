// app.js
const express = require('express');
const { errors } = require('celebrate');

// Import your routes here
const userRoutes = require('./routes/users.js');
const itemRoutes = require('./routes/clothingItems');

const app = express();

// Middlewares for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup routes
 app.use('/users', userRoutes);
 app.use('/items', itemRoutes);

// Celebrate error handling middleware
app.use(errors());

// Centralized error handler
app.use((err, req, res, next) => {
  if (!err) {
    return next();
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || 'An unexpected error occurred';

  // If the error is a Celebrate error, customize the response
  if (err.isCelebrate) {
    statusCode = 400;
    message = 'Validation failed';
    const details = err.details.get('body') || err.details.get('params') || err.details.get('query');
    if (details) {
      message = details.message;
    }
  }

  res.status(statusCode).json({
    status: 'error',
    message: message,
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // Exporting for testing purposes
