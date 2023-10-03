const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here'; // Make sure to use an environment variable for this in a real-world application!

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).send({ message: 'Authorization required' });
    }

    const token = authorization.replace("Bearer ", "");

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    } catch (err) {
        res.status(401).send({ message: 'Invalid token' });
    }
};
