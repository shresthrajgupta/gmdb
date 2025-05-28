const axios = require("axios");

const ytkey = process.env.YT_API;

const homepageController = async (req, res, next) => {
    try {
        const user = req.user;

        const finalResponse = { ...user };

        // const trailercall = `https://www.googleapis.com/youtube/v3/search?key=${ytkey}&channelId=UCJx5KP-pCUmL9eZUv-mIcNw&part=snippet,id&order=date&maxResults=8`;
        // const trailerData = await axios.get(trailercall).then(response => response.data);
        // finalResponse.yttrailers = trailerData?.items?.map(item => {
        //     const itm = {};
        //     itm.title = item.snippet.title;
        //     itm.thumbnail = item.snippet.thumbnails.medium.url;
        //     itm.url = `https://www.youtube.com/watch?v=${item.id.videoId}`;

        //     return itm;
        // });

        // const bestGamesCall = `https://www.googleapis.com/youtube/v3/search?key=${ytkey}&q=best video games list of all time&part=snippet,id&order=relevance&type=video&maxResults=8`;
        // const bestGameData = await axios.get(bestGamesCall).then(response => response.data);
        // finalResponse.ytbestgames = bestGameData?.items?.map(item => {
        //     const itm = {};
        //     itm.title = item.snippet.title;
        //     itm.thumbnail = item.snippet.thumbnails.medium.url;
        //     itm.url = `https://www.youtube.com/watch?v=${item.id.videoId}`;

        //     return itm;
        // });

        return res.status(200).json({ message: "fetched homepage successfully", data: finalResponse });
    } catch (err) {
        console.error("Youtube quota limit exceeded");
        res.status(500).json({ error: "Error fetching homepage data" });
    }
};

module.exports = homepageController;