const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("./UnauthorizedError"); // Adjusted import path

module.exports = (req, res, next) => {
  const authorization = req.header("Authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authentication required");
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next(); // Proceed to the next middleware
  } catch (e) {
    throw new UnauthorizedError("Invalid token");
  }
};
