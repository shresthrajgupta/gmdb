require("dotenv").config();

const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use(cors({
  origin: 'https://gmdb-frontend.onrender.com',
  credentials: true,
}));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

const userRoute = require("./routes/user_route");
const gameRoute = require("./routes/game_route");
const franchiseRoute = require("./routes/franchise_route");
const homeRoute = require("./routes/home_route");

app.use("/user", userRoute);
app.use("/game", gameRoute);
app.use("/franchise", franchiseRoute);
app.use("/home", homeRoute);

app.all('*', (req, res, next) => {
    return res.status(404).json({ message: `Can't find ${req.url} on the server` })
});

async function main() {
    try {
        await mongoose.connect(`${process.env.MDB_URL}`);
        app.listen(port, () => {
            console.log(`App listening on port ${port}`);
        });
    } catch (err) {
        console.log(err);
    }
}

main();