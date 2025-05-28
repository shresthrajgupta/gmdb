const User = require("../models/user_model");

const { parseUtil } = require("../utils/jwt_util");

const showPlaylistController = async (req, res, next) => {
    try {
        const pageNo = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (pageNo - 1) * limit;

        const userNonPopulated = await User.findById(req.user._id).select('toPlay').exec();
        let totalCount = userNonPopulated.toPlay.length;
        totalCount = Math.ceil(totalCount / limit);

        if (pageNo <= 0 || pageNo > totalCount)
            return res.status(200).json({
                message: "Page out of limits",
                data: { _id: req.user._id, toPlay: [], totalPages: totalCount }
            });

        const userPopulated = await User.findById(req.user._id).select('toPlay').populate({
            path: "toPlay", select: "name id guid poster url",
            options: { limit: limit, skip: skip }
        }).exec();

        userPopulated.totalPages = totalCount;

        const payload = { _id: userPopulated._id, toPlay: userPopulated.toPlay, totalPages: totalCount };
        // payload.data.totalPages = totalCount;

        // console.log(payload);

        res.status(200).json({
            message: "Playlist fetched successfully",
            data: payload
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error fetching playlist" });
    }
};

const addPlaylistController = async (req, res, next) => {
    try {
        const { gameId } = req.body;
        const { id } = parseUtil(req);

        const user = await User.findById(id);

        if (!user.toPlay)
            user.toPlay = [];

        if (user.toPlay.includes(gameId))
            return res.status(400).json({ error: "game already exists in playlist" });

        if (user.finished.includes(gameId))
            await User.findByIdAndUpdate(id, { $pull: { finished: gameId } });

        await User.findByIdAndUpdate(id, { $push: { toPlay: gameId } });

        return res.status(200).json({ message: "Playlist updated" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error in adding game into playlist" });
    }
};

const delPlaylistController = async (req, res, next) => {
    try {
        const { gameId } = req.body;
        const { id } = parseUtil(req);

        const user = await User.findById(id);

        if (!user.toPlay.includes(gameId))
            return res.status(400).json({ error: "Does not exist in playlist" });

        await User.findByIdAndUpdate(id, { $pull: { toPlay: gameId } });

        return res.status(200).json({ message: "Playlist updated" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error in deleting game from playlist" });
    }
};

module.exports = { showPlaylistController, addPlaylistController, delPlaylistController };