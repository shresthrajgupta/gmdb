const { validationResult } = require("express-validator");

const validateInputUtil = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    next();
};

module.exports = validateInputUtil;