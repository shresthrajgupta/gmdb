const axios = require("axios");

const Franchise = require("../models/franchise_model");
const Game = require("../models/game_model");

const apikey = process.env.GIANTBOMB_API;

const franchiseDetailController = async (req, res, next) => {
    try {
        const mainGuid = req.params.guid;

        const mainFranchise = await Franchise.findOne({ guid: mainGuid }).populate("games", "name id guid url").exec();
        if (mainFranchise && mainFranchise.deck !== "null")
            return res.status(200).json({ message: "Franchise data fetched successfully", data: mainFranchise });
        else {
            const apicall = `https://www.giantbomb.com/api/franchise/${mainGuid}/?api_key=${apikey}&format=json&field_list=deck,games,guid,id,image,name`;
            const doc = await axios.get(apicall).then(response => response.data);
            const statusCode = doc.status_code;
            if (statusCode !== 1)
                return res.status(400).json({ error: "Error fetching franchise details" });
            const data = doc.results;

            const franchiseData = {
                name: data.name,
                url: `/franchise/guid/${mainGuid}`,
                deck: data.deck,
                guid: mainGuid,
                id: data.id,
                poster: data.image.smallurl
            }

            // filling game in .games
            let gamesArr = [];
            for (let i = 0; i < data.games.length; i++) {
                const g = data.games[i];

                const arr = g.api_detail_url.split("/");
                const guid = arr[arr.length - 2];

                const cnt = await Game.countDocuments({ guid });

                let game;
                if (cnt > 0)
                    game = await Game.findOne({ guid });
                else
                    game = await Game.create({ name: g.name, id: g.id, guid, url: `/game/guid/${guid}` });

                gamesArr.push(game);
            }
            franchiseData.games = gamesArr;

            const id = await Franchise.exists({ guid: mainGuid });
            if (id === null)
                await Franchise.create(franchiseData);
            else
                await Franchise.findByIdAndUpdate(id, franchiseData);

            const currFranchise = await Franchise.findOne({ guid: mainGuid }).populate("games", "name id guid url").exec();

            return res.status(200).json({ message: "Franchise data fetched successfully", data: currFranchise });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching franchise details" });
    }
};

module.exports = franchiseDetailController;