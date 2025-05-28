const axios = require("axios");

const Game = require("../models/game_model");
const Franchise = require("../models/franchise_model");
const User = require("../models/user_model");

const apikey = process.env.GIANTBOMB_API;

const gameDetailController = async (req, res, next) => {
    try {
        const mainGuid = req.params.guid;

        const mainGame = await Game.findOne({ guid: mainGuid }).populate("franchises", "name id guid url").populate("similar_games", "name id guid url").lean().exec();
        if (mainGame && mainGame.deck !== "null") {
            let isPlaying = await User.findOne({
                _id: req.user._id,
                toPlay: { $elemMatch: { $eq: mainGame._id } }
            }).exec();

            let isCompleted = await User.findOne({
                _id: req.user._id,
                finished: { $elemMatch: { $eq: mainGame._id } }
            }).exec();

            mainGame.isPlaying = isPlaying ? true : false;
            mainGame.isCompleted = isCompleted ? true : false;
            return res.status(200).json({ message: "Game data fetched successfully", data: mainGame });
        }
        else {
            const apicall = `https://www.giantbomb.com/api/game/${mainGuid}/?api_key=${apikey}&format=json&field_list=name,deck,expected_release_day,expected_release_month,expected_release_year,guid,id,original_game_rating,original_release_date,platforms,developers,franchises,genres,publishers,dlcs,similar_games,themes,image`;
            const doc = await axios.get(apicall).then(response => response.data);
            const statusCode = doc.status_code;
            if (statusCode !== 1)
                return res.status(400).json({ error: "Error fetching game details" });
            const data = doc.results;

            const gameData = {
                name: data.name,
                url: `/game/guid/${data.guid}`,
                deck: data.deck,
                expected_release_day: data.expected_release_day,
                expected_release_month: data.expected_release_month,
                expected_release_year: data.expected_release_year,
                guid: data.guid,
                id: data.id,
                poster: data.image.small_url,
                original_game_rating: data.original_game_rating?.map(rating => rating.name),
                original_release_date: data.original_release_date,
                platforms: data.platforms?.map(platform => platform.name),
                developers: data?.developers?.map(developer => developer.name),
                genres: data?.genres?.map(genre => genre.name),
                publishers: data?.publishers?.map(publisher => publisher.name),
                // dlcs: data?.dlcs?.length > 0 ? [...new Set(data.dlcs?.map(dlc => dlc.name))] : "",
                dlcs: [...new Set(data.dlcs?.map(dlc => dlc.name))],
                themes: data?.themes?.map(theme => theme.name)
            }

            // filling franchises in .franchises
            let franchiseArr = [];
            for (let i = 0; i < data.franchises?.length; i++) {
                const f = data.franchises[i];

                const arr = f.api_detail_url.split("/");
                const guid = arr[arr.length - 2];

                const cnt = await Franchise.countDocuments({ guid });

                let franchise;
                if (cnt > 0)
                    franchise = await Franchise.findOne({ guid });
                else
                    franchise = await Franchise.create({ name: f.name, id: f.id, guid, url: `/franchise/guid/${guid}` });

                franchiseArr.push(franchise);
            }
            gameData.franchises = franchiseArr;


            // filling games in .similar_games
            let similarGamesArr = [];
            for (let i = 0; i < data.similar_games?.length; i++) {
                const g = data.similar_games[i];

                const arr = g.api_detail_url.split("/");
                const guid = arr[arr.length - 2];

                const cnt = await Game.countDocuments({ guid });

                let game;
                if (cnt > 0)
                    game = await Game.findOne({ guid });
                else
                    game = await Game.create({ name: g.name, id: g.id, guid, url: `/game/guid/${guid}` });

                similarGamesArr.push(game);
            }
            gameData.similar_games = similarGamesArr;

            const id = await Game.exists({ guid: mainGuid });
            if (id === null)
                await Game.create(gameData);
            else
                await Game.findByIdAndUpdate(id, gameData);

            const currGame = await Game.findOne({ guid: mainGuid }).populate("franchises", "name id guid url").populate("similar_games", "name id guid url").lean().exec();

            let isPlaying = await User.findOne({
                _id: req.user._id,
                toPlay: { $elemMatch: { $eq: currGame._id } }
            }).exec();

            let isCompleted = await User.findOne({
                _id: req.user._id,
                finished: { $elemMatch: { $eq: currGame._id } }
            }).exec();

            currGame.isPlaying = isPlaying ? true : false;
            currGame.isCompleted = isCompleted ? true : false;

            // console.log(isPlaying, isCompleted);

            return res.status(200).json({ message: "Game data fetched successfully", data: currGame });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching game details" });
    }
};

module.exports = gameDetailController;