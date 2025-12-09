const jwt = require("jsonwebtoken");

 function auth (req, res, next) {

    const token = req.header("Authorization");

    if (!token) return res.status(401).json({ message: "Access denied, no token" });

    try {
        const verified = jwt.verify(token, "SECRET_KEY_123");
        req.user = verified;  // بنخزن بيانات اليوزر
        next();
    } catch (e) {
        res.status(400).json({ message: "Invalid token" });
    }
};

module.exports = auth;