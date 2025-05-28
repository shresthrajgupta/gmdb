const router = require("express").Router();

const homepageController = require("../controllers/homepage_controller");

const { isLoggedIn } = require("../middlewares/auth_middleware");

router.get("/",
    isLoggedIn,
    homepageController
);

module.exports = router;