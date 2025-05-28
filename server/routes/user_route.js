const router = require("express").Router();
const { body, header } = require("express-validator");

const validateInputUtil = require("../utils/validateinput_util");

const { registerController, verifyController } = require("../controllers/register_controller");
const loginController = require("../controllers/login_controller");
const { getProfileController } = require("../controllers/profile_controller");
const { forgotPassOtp, forgotPassVerify } = require("../controllers/forgotpass_controller");

const { isLoggedIn } = require("../middlewares/auth_middleware");


router.post(
    "/register",
    [
        body("name", "Name must be between 8 and 15 characters").isString().isLength({ min: 8, max: 15 }),
        body("email", "Email is required").trim().isEmail(),
        body("password", "Password must be between 8 and 15 characters").isLength({ min: 8, max: 15 }),
    ],
    validateInputUtil,
    registerController
);

router.post(
    "/verify",
    [
        body("otp", "Invalid OTP").isLength({ min: 6, max: 6 }),
        header("Authorization", "Token is required").exists(),
    ],
    validateInputUtil,
    verifyController
);

router.post(
    "/login",
    [
        body("email", "Invalid Email or Password").trim().isEmail(),
        body("password", "Invalid Email or Password").isLength({ min: 8 }),
    ],
    validateInputUtil,
    loginController
);

router.post(
    "/forgot_otp",
    [
        body("email", "Please provide an email").trim().isEmail(),
        body("password", "Please provide a password").isLength({ min: 8 }),
        body("retype_password", "Passwords must be same").isLength({ min: 8 })
    ],
    validateInputUtil,
    forgotPassOtp
);

router.post(
    "/forgot_verify",
    [
        body("otp", "Invalid OTP").isLength({ min: 6, max: 6 }),
    ],
    validateInputUtil,
    forgotPassVerify
);

router.get("/profile", isLoggedIn, getProfileController);

// router.put("/profile", isLoggedIn, updateProfile);

// router.get(
//     "/logout",
//     isLoggedIn,
//     logoutUser
// );


module.exports = router;