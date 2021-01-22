const express = require("express");
const fetch = require("node-fetch");
const app = express();
require("dotenv").config();
const port = 5000;

// Retrieve data about the player and their battlelog
app.get("/playerData/:playerID", (req, res) => {
  let playerData = {};
  let battleLogData = {};

  const playerID = req.params.playerID;

  // Secure player data
  fetch(`https://api.brawlstars.com/v1/players/%23${playerID}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + process.env.API_KEY,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      playerData = data;
      // Secure battlelog data
      fetch(
        "https://api.brawlstars.com/v1/players/%23" + playerID + "/battlelog",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + process.env.API_KEY,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          battleLogData = data;
          // Combine battlelog and player data and send back as single object
          res.send({
            ...playerData,
            battles: battleLogData.items,
          });
        });
    });
});

// // Retrieve player battlelog data
// app.get("/playerData/:playerID/battlelog", (req, res) => {
//   const playerID = req.params.playerID;
//   fetch("https://api.brawlstars.com/v1/players/%23" + playerID + "/battlelog", {
//     method: "GET",
//     headers: {
//       Accept: "application/json",
//       Authorization: "Bearer " + process.env.API_KEY,
//     },
//   })
//     .then((response) => response.json())
//     .then((data) => res.send(data));
// });

// Club support
app.get("/clubData/:clubID", (req, res) => {
  const clubID = req.params.clubID;
  let club = {};

  fetch(`https://api.brawlstars.com/v1/clubs/%23${clubID}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + process.env.API_KEY,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      club = data;
      res.send(club);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
