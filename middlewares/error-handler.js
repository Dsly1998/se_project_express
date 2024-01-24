const { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError } = require('./custom-errors');

const errorHandler = (err, req, res, next) => {
    // Log the error along with additional request information for better debugging
    console.error("Error:", err);
    console.error("Error occurred in route:", req.path);
    console.error("Request method:", req.method);

    // Check if the error is an instance of our custom error classes
    if (err instanceof BadRequestError || 
        err instanceof UnauthorizedError || 
        err instanceof ForbiddenError || 
        err instanceof NotFoundError || 
        err instanceof ConflictError) {
        // Use the status code and message from the custom error
        return res.status(err.statusCode).json({ message: err.message });
    }

    // For other types of errors (including internal server errors)
    const statusCode = err.statusCode || 500;
    const message = statusCode === 500 ? "Internal Server Error" : err.message;

    // Send the error response
    res.status(statusCode).json({ message: message });
};

module.exports = errorHandler;
