const router = require("express").Router();

const franchiseDetailController = require("../controllers/franchisedetail_controller");

const { isLoggedIn } = require("../middlewares/auth_middleware");

router.get("/guid/:guid",
    isLoggedIn,
    franchiseDetailController
);

module.exports = router;