// config.js

require('dotenv').config(); // Load environment variables from .env file

// Define a default JWT secret for development mode
const DEFAULT_JWT_SECRET = 'YourDefaultSecretKey';

// Use the value from the .env file in production or the default value in development
const JWT_SECRET = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;

module.exports = {
  JWT_SECRET,
};
