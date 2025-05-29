const router = require("express").Router();
const { check } = require("express-validator");

const gameDetailController = require("../controllers/gamedetail_controller");
const gameSearchController = require("../controllers/gamesearch_controller");
const { addPlaylistController, delPlaylistController, showPlaylistController } = require("../controllers/playlist_controller");
const { addCompletedListController, delCompletedListController, showCompletedListController } = require("../controllers/completedlist_controller");
const { getRating, postRating } = require("../controllers/rating_controller");

const validateInputUtil = require("../utils/validateinput_util");

const { isLoggedIn } = require("../middlewares/auth_middleware");

router.get("/guid/:guid",
    isLoggedIn,
    gameDetailController
);

router.get("/search",
    isLoggedIn,
    [
        check("q", "parameter is required").notEmpty()
    ],
    validateInputUtil,
    gameSearchController
);

// playlist
router.get("/playlist",
    isLoggedIn,
    showPlaylistController
)

router.post("/playlist",
    isLoggedIn,
    addPlaylistController
);

router.delete("/playlist",
    isLoggedIn,
    delPlaylistController
);

// completed list
router.get("/completedlist",
    isLoggedIn,
    showCompletedListController
)

router.post("/completedlist",
    isLoggedIn,
    addCompletedListController
);

router.delete("/completedlist",
    isLoggedIn,
    delCompletedListController
);

router.post("/rating",
    isLoggedIn,
    [
        check("gameId", "gameId is required").notEmpty(),
        check("score", "score must be between 0 and 5").isInt({ min: 0, max: 5 })
    ],
    validateInputUtil,
    postRating
);

router.get("/rating/:gameId",
    isLoggedIn,
    getRating
);

module.exports = router;