const BadRequestError = require("./BadRequestError");
const UnauthorizedError = require("./UnauthorizedError");
const ForbiddenError = require("./ForbiddenError");
const NotFoundError = require("./NotFoundError");
const ConflictError = require("./ConflictError");
const ServerError = require("./ServerError"); // Import ServerError

const errorHandler = (err, req, res) => {
  // Log the error along with additional request information for better debugging
  console.error("Error:", err);
  console.error("Error occurred in route:", req.path);
  console.error("Request method:", req.method);

  // Check if the error is an instance of our custom error classes
  if (
    err instanceof BadRequestError ||
    err instanceof UnauthorizedError ||
    err instanceof ForbiddenError ||
    err instanceof NotFoundError ||
    err instanceof ConflictError ||
    err instanceof ServerError // Include ServerError in the check
  ) {
    // Use the status code and message from the custom error
    return res.status(err.statusCode).json({ message: err.message });
  }

  // For other types of errors (including internal server errors)
  const statusCode = 500; // Default to 500 for any other types of errors
  const message = "Internal Server Error"; // Default message for unknown errors

  // Send the error response
  return res.status(statusCode).json({ message });
};

module.exports = errorHandler;
