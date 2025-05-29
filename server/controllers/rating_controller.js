const mongoose = require("mongoose");

const Game = require("../models/game_model");
const Rating = require("../models/rating_model");

const { parseUtil } = require("../utils/jwt_util");

const postRating = async (req, res, next) => {
    try {
        const { id } = parseUtil(req);
        const gameId = (await Game.findOne({ guid: req.body.gameId }).select("_id"))._id.toHexString();
        const { score } = req.body;

        if (!id || !gameId || score === undefined || score === null || score < 0 || score > 5) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid User ID format" });
        }

        if (!mongoose.Types.ObjectId.isValid(gameId)) {
            return res.status(400).json({ error: "Invalid Game ID format" });
        }

        await Rating.findOneAndUpdate(
            {
                user: mongoose.Types.ObjectId.createFromHexString(id),
                game: mongoose.Types.ObjectId.createFromHexString(gameId)
            },
            {
                score: score
            },
            {
                upsert: true,  // Create if doesn't exist
                runValidators: true  // Run schema validators
            }
        );

        return res.status(200).json({
            message: "Rating updated successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error updating rating" });
    }
};

const getRating = async (req, res, next) => {
    try {
        const gameId = (await Game.findOne({ guid: req.params.gameId }).select("_id"))._id.toHexString();
        const { id } = parseUtil(req);

        if (!gameId || !mongoose.Types.ObjectId.isValid(gameId)) {
            return res.status(400).json({ error: "Invalid game ID" });
        }

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const result = (await Rating.aggregate([
            { $match: { game: mongoose.Types.ObjectId.createFromHexString(gameId) } },
            {
                $group: {
                    _id: "$game",
                    avg: { $avg: "$score" },
                    count: { $sum: 1 }
                }
            }
        ]));

        const avgRating = result[0]?.avg || 0;
        const countRating = result[0]?.count || 0;

        const userRating = (await Rating.findOne({
            user: mongoose.Types.ObjectId.createFromHexString(id),
            game: mongoose.Types.ObjectId.createFromHexString(gameId)
        }, { score: 1 }))?.score || 0;

        return res.status(200).json({
            message: "Rating fetched successfully",
            data: { average: avgRating, user: userRating, count: countRating }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error fetching rating" });
    }
};

module.exports = { getRating, postRating };