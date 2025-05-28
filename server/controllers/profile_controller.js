const User = require("../models/user_model");

const getProfileController = async (req, res, next) => {
    try {
        const profile = { ...req.user }; // create a shallow copy
        delete profile._id;
        delete profile.isAdmin;
        delete profile.createdAt;
        delete profile.__v;

        // console.log(req.user);

        return res.json(profile);

    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "Error fetching profile" });
    }
};

module.exports = { getProfileController };