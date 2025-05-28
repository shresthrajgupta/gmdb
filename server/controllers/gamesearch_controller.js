const axios = require("axios");

const apikey = process.env.GIANTBOMB_API;

const gameSearchController = async (req, res, next) => {
    try {
        const query = req.query.q;
        const apicall = `http://www.giantbomb.com/api/search/?api_key=${apikey}&format=json&query=${query}&resources=game&field_list=name,guid,id`;
        const doc = await axios.get(apicall).then(response => response.data);
        const statusCode = doc.status_code;
        if (statusCode !== 1)
            return res.status(400).json({ error: "Error searching game" });
        const data = doc.results;

        for (let i = 0; i < data.length; i++) {
            const url = `/game/guid/${data[i].guid}`;
            data[i].url = url;
        }

        return res.status(200).json({ message: "Query searched successfully", data });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error searching game" });
    }
};

module.exports = gameSearchController;