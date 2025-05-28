const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

const generateUtil = (data, expiresIn = "60m") => {
    const token = jwt.sign(data, secret, { expiresIn: expiresIn });
    return token;
};

const parseUtil = (req) => {
    const token = req.headers.authorization.split(" ")[1];
    return jwt.verify(token, secret);
};

module.exports = { generateUtil, parseUtil };