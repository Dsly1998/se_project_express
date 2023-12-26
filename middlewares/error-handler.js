const { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError } = require('./custom-errors');

const errorHandler = (err, req, res, next) => {
    console.error(err);

    // Determine the status code from the error, default to 500 if not specified
    const statusCode = err.statusCode || 500;

    // Determine the error message
    const message = err.message || "Internal Server Error";

    // Send the error response
    res.status(statusCode).json({
        message: message
    });
};

module.exports = errorHandler;
