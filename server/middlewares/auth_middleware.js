const User = require("../models/user_model");

const { parseUtil } = require("../utils/jwt_util");

const isLoggedIn = async (req, res, next) => {
    if (!req.headers.authorization)
        return res.status(401).json({ error: "Authorization token is required" });

    if (!req.headers.authorization.startsWith("Bearer"))
        return res.status(401).json({ error: "Invalid token" });

    const token = req.headers.authorization.split(" ")[1];

    if (!token)
        return res.status(401).json({ error: "Authorization token is required" });

    try {
        const data = parseUtil(req);

        // const user = await User.findById(data.id).populate("toPlay", "name id guid poster url").exec();
        const user = await User.findById(data.id).populate({ path: "toPlay", select: "name id guid poster url", options: { limit: 8 } }).exec();

        if (!user)
            return res.status(400).json({ error: "User not found" });

        const userObj = user.toObject();
        delete userObj["password"];

        req.user = userObj;
        req.token = token

        next();

    } catch (err) {
        if (err.name === 'TokenExpiredError')
            return res.status(401).json({ error: "Token expired" });
        return res.status(401).json({ error: "Invalid token" });
    }
};

const isAdmin = (req, res, next) => {
    if (!req.user.isAdmin)
        return res.status(403).json({ error: "Unauthorized" });

    next();
};

module.exports = { isLoggedIn, isAdmin };