// utils/errors.js

const NOT_FOUND = 404;
const SERVER_ERROR = 500;

// ... (other constants or exports you might have in this file)

module.exports = {
  ...module.exports, // To ensure you're still exporting other things from this file
  NOT_FOUND,
  SERVER_ERROR,
};
