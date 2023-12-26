// BadRequestError for status code 400
class BadRequestError extends Error {
    constructor(message) {
      super(message);
      this.statusCode = 400;
    }
  }
  
  // UnauthorizedError for status code 401
  class UnauthorizedError extends Error {
    constructor(message) {
      super(message);
      this.statusCode = 401;
    }
  }
  
  // ForbiddenError for status code 403
  class ForbiddenError extends Error {
    constructor(message) {
      super(message);
      this.statusCode = 403;
    }
  }
  
  // NotFoundError for status code 404
  class NotFoundError extends Error {
    constructor(message) {
      super(message);
      this.statusCode = 404;
    }
  }
  
  // ConflictError for status code 409
  class ConflictError extends Error {
    constructor(message) {
      super(message);
      this.statusCode = 409;
    }
  }
  
  // Export all the custom error constructors
  module.exports = {
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError
  };
  