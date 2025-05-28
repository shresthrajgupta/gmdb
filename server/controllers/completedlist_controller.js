const User = require("../models/user_model");

const { parseUtil } = require("../utils/jwt_util");


const showCompletedListController = async (req, res, next) => {
    try {
        const pageNo = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (pageNo - 1) * limit;

        const userNonPopulated = await User.findById(req.user._id).select('finished').exec();
        let totalCount = userNonPopulated.finished.length;
        totalCount = Math.ceil(totalCount / limit);

        if (pageNo <= 0 || pageNo > totalCount)
            return res.status(200).json({
                message: "Page out of limits",
                data: { _id: req.user._id, finished: [], totalPages: totalCount }
            });

        const userPopulated = await User.findById(req.user._id).select('finished').populate({
            path: "finished", select: "name id guid poster url",
            options: { limit: limit, skip: skip }
        }).exec();

        userPopulated.totalPages = totalCount;

        const payload = { _id: userPopulated._id, finished: userPopulated.finished, totalPages: totalCount };
        // payload.data.totalPages = totalCount;

        // console.log(payload);

        res.status(200).json({
            message: "Completed list fetched successfully",
            data: payload
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error in fetching completed list" });
    }
};

const addCompletedListController = async (req, res, next) => {
    try {
        const { gameId } = req.body;
        const { id } = parseUtil(req);

        const user = await User.findById(id);

        if (!user.finshed)
            user.finished = [];

        if (user.finished.includes(gameId))
            return res.status(400).json({ error: "game already exists in completed list" });

        if (user.toPlay.includes(gameId))
            await User.findByIdAndUpdate(id, { $pull: { toPlay: gameId } });

        await User.findByIdAndUpdate(id, { $push: { finished: gameId } });

        return res.status(200).json({ message: "Completed list updated" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error in adding game into completed list" });
    }
};

const delCompletedListController = async (req, res, next) => {
    try {
        const { gameId } = req.body;
        const { id } = parseUtil(req);

        const user = await User.findById(id);

        if (!user.finished.includes(gameId))
            return res.status(400).json({ error: "Does not exist in completed list" });

        await User.findByIdAndUpdate(id, { $pull: { finished: gameId } });

        return res.status(200).json({ message: "Completed list updated" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error in deleting game from completed list" });
    }
};

module.exports = { showCompletedListController, addCompletedListController, delCompletedListController };