const bcrypt = require("bcryptjs");

const User = require("../models/user_model");

const { mailerUtil } = require("../utils/mailer_util");

const forgotPassOtp = async (req, res, next) => {
    try {
        const { email, password, retype_password } = req.body;

        if (password !== retype_password)
            return res.status(400).json({ error: "Passwords do not match" });

        const user = await User.exists({ email });

        if (user === null)
            return res.status(400).json({ error: "Enter a valid email id" });

        let otp = Math.floor(100000 + Math.random() * 900000);
        mailerUtil({
            from: process.env.EMAIL_ID,
            to: email,
            subject: "OTP",
            text: `Your OTP is ${otp}`,
        });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(`${password}`, salt);
        const hashedOtp = await bcrypt.hash(`${otp}`, salt);

        const payload = { email, hashedOtp, id: user, hashedPassword };
        const token = generateUtil(payload);

        return res.status(200).json({
            message: "OTP sent successfully",
            data: {
                token: token,
            },
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Please try again later" });
    }
};

const forgotPassVerify = async (req, res, next) => {
    try {
        const otp = parseInt(req.body.otp);

        const { email, hashedOtp, id, hashedPassword } = parseUtil(req);

        const isMatch = await bcrypt.compare(`${otp}`, hashedOtp);
        if (!isMatch)
            return res.status(400).json({ error: "Invalid OTP" });

        await User.findByIdAndUpdate(id, { password: hashedPassword });

        return res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Please try again later" });
    }
};

module.exports = { forgotPassOtp, forgotPassVerify };