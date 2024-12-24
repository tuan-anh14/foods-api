/** @format */

const jwt = require('jsonwebtoken');
const asyncHandle = require('express-async-handler');

const verifyToken = asyncHandle((req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Attach user data to request object
        req.user = {
            id: decoded.id,
            email: decoded.email,
            photo: decoded.photo,
            phone: decoded.phone,
            name: decoded.name,
            address: decoded.address
        };

        next();
    } catch (error) {
        console.error(error);
        return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
    }
});

module.exports = verifyToken;
