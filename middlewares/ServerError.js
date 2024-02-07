class ServerError extends Error {
  constructor(message = "Internal Server Error") {
    super(message);
    this.statusCode = 500;
  }
}

module.exports = ServerError;
