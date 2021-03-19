const { response } = require("express");
const express = require("express");
const fetch = require("node-fetch");
const app = express();
require("dotenv").config();
const port = 5000;
const apiKey = process.env.API_KEY;
const PlayerModel = require("./PlayerModel");

// Retrieve data about the player and their battlelog
app.get("/playerData/:playerID", (req, res) => {
  let playerData = {};

  const playerID = req.params.playerID;

  const handleError = (err) => console.log(err);

  // Secure player data
  fetch(`https://api.brawlstars.com/v1/players/%23${playerID}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + apiKey,
    },
  })
    .then((response) => {
      // Send 404 if player does not exist
      // If that happens then rejected promise is returned and triggers catch block at the end
      // All that does is console.log the error
      if (response.ok) {
        return response.json();
      } else {
        res.sendStatus(404);
        return;
      }
    })
    .then((data) => {
      playerData = data;
      // Secure battlelog data
      fetch(
        "https://api.brawlstars.com/v1/players/%23" + playerID + "/battlelog",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + apiKey,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          let battleLogData = data;
          let model = new PlayerModel.PlayerModel({
            ...playerData,
            battles: battleLogData.items,
          });
          let response = {
            ...playerData,
            trophiesOverTime: model.TrophiesOverTime(),
            recentGameModes: model.RecentGameModes(),
            winLose: model.NumberWins(),
            recentBrawlers: model.RecentBrawlers(),
            brawlerData: model.GetBrawlersTrophies(),
            starPlayerCount: model.StarPlayerCount(),
          };

          // Combine battlelog and player data and send back as single object
          res.send(response);
        })
        .then(() => console.log("Request completed."))
        .catch(handleError);
    });
});

// Retrieve player battlelog data
app.get("/playerData/:playerID/battlelog", (req, res) => {
  const playerID = req.params.playerID;
  fetch("https://api.brawlstars.com/v1/players/%23" + playerID + "/battlelog", {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + apiKey,
    },
  })
    .then((response) => {
      // Send 404 if player does not exist
      // If that happens then rejected promise is returned and triggers catch block at the end
      // All that does is console.log the error
      if (response.ok) {
        return response.json();
      } else {
        res.sendStatus(404);
        return;
      }
    })
    .then((data) => {
      battlelog = data;
      fetch("https://api.brawlstars.com/v1/players/%23" + playerID, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + apiKey,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          let model = new PlayerModel.PlayerModel({
            ...data,
            battles: battlelog.items,
          });
          let response = {
            battles: battlelog,
            ...data,
            starPlayerCount: model.StarPlayerCount()
          };
          res.send(response);
        });
    });
});

// Club support
app.get("/clubData/:clubID", (req, res) => {
  const clubID = req.params.clubID;
  let club = {};

  fetch(`https://api.brawlstars.com/v1/clubs/%23${clubID}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + apiKey,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      club = data;
      res.send(club);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
