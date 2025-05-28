const bcrypt = require("bcryptjs");

const User = require("../models/user_model");

const { generateUtil } = require("../utils/jwt_util");
const jwtExpiryTime = 86400;

const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(401).send({ error: "Invalid Email or Password" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            return res.status(401).send({ error: "Invalid Email or Password" });

        const token = generateUtil({ id: user._id }, jwtExpiryTime);

        return res.json({
            message: "Logged in successfully",
            data: { token }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = loginController;