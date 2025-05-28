const bcrypt = require("bcryptjs");

const User = require("../models/user_model");

const { parseUtil, generateUtil } = require("../utils/jwt_util");
const mailerUtil = require("../utils/mailer_util");

const registerController = async (req, res) => {
    try {
        const { name, password, email } = req.body;

        const user = await User.findOne({ email });
        if (user)
            return res.status(400).json({ error: "Email already exists" });

        let otp = Math.floor(100000 + Math.random() * 900000);
        mailerUtil({
            from: process.env.EMAIL_ID,
            to: email,
            subject: "OTP",
            text: `Your OTP is ${otp}`,
        });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        hashedOtp = await bcrypt.hash(`${otp}`, salt);

        const payload = { email, name, hashedPassword, hashedOtp };
        const token = generateUtil(payload);

        return res.status(200).json({
            message: "OTP sent successfully",
            data: {
                token: token,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const verifyController = async (req, res, next) => {
    try {
        const otp = parseInt(req.body.otp);

        const { email, hashedOtp, name, hashedPassword } = parseUtil(req);

        const isMatch = await bcrypt.compare(`${otp}`, hashedOtp);
        if (!isMatch)
            return res.status(400).json({ error: "Invalid OTP" });

        await User.create({ name, email, password: hashedPassword });

        return res.status(200).json({
            message: "Account created successfully"
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { registerController, verifyController };