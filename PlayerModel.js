class PlayerModel {
    constructor(data) {
      // The number of 3 v3 victories
      this.victories = data["3vs3Victories"];
      // The player battle log
      this.battles = data.battles;
      // Best time in roboRumble, integer
      this.roboRumbleTime = data.bestRoboRumbleTime;
      // Best time as big brawler, integer
      this.bigBrawlerTime = data.bestTimeAsBigBrawler;
      // Array of brawlers the player owns
      this.brawlers = data.brawlers;
      // Object with .name and .tag
      this.club = data.club;
      // Number of duo victories, integer
      this.duoVictories = data.duoVictories;
      // Experience level, integer
      this.expLevel = data.expLevel;
      // Experience points, integer
      this.expPoints = data.expPoints;
      this.highestPowerPlayPoints = data.highestPowerPlayPoints;
      // Object with .id
      this.icon = data.icon;
      // Boolean
      this.isQualifiedFromChampionshipChallenge =
        data.isQualifiedFromChampionshipChallenge;
      // Name of the player, string
      this.name = data.name;
      // Color of the player name, string
      this.nameColor = data.nameColor;
      // Number of solo victories, integer
      this.soloVictories = data.soloVictories;
      // Player game tag, string
      this.tag = data.tag;
      // Number of current trophies, integer
      this.trophies = data.trophies;
    }
  
    // Determine a players trophies over time based on the battle log data and current trophy count 
    TrophiesOverTime() {
      let currentCount = this.trophies;
      let trophies = [currentCount];
      this.battles.forEach((game) => {
        if ("trophyChange" in game.battle) {
          currentCount -= game.battle.trophyChange;
          trophies = [currentCount, ...trophies];
        } else {
          trophies = [currentCount, ...trophies];
        }
      });
      return trophies;
    }
  
    // Determine the number of games a player has been awarded star player out of their recent games
    StarPlayerCount() {
      let gamesStarPlayer = 0;
      this.battles.forEach((game) => {
        if ("starPlayer" in game.battle) {
          if (game.battle.starPlayer.tag === this.tag) {
            gamesStarPlayer += 1;
          }
        }
      });
      return gamesStarPlayer;
    }
  
    // Return recent game modes as a javascript object where gamemode: #games
    RecentGameModes() {
      let gameModes = {};
      this.battles.forEach((game) => {
        let gameMode = game.event.mode;
        if (gameMode in gameModes) {
          gameModes[gameMode] += 1;
        } else {
          gameModes[gameMode] = 1;
        }
      });
      return gameModes;
    }
  
    // Return trophies for each brawler, to use split the array down the middle 
    GetBrawlersTrophies() {
      let brawlers = [];
      let trophies = [];
      this.brawlers.forEach((brawler) => {
        brawlers.push(brawler.name);
        trophies.push(brawler.trophies);
      });
      return [...brawlers, ...trophies];
    }
  
    // Determine the number of games the player has recently won, out of their total number of games
    NumberWins() {
      let wins = 0;
      this.battles.forEach((game) => {
        if (game.battle.result === "victory") {
          wins += 1;
        }
      });
      return [wins, this.battles.length - wins];
    }
  
    // Recently played brawlers
    RecentBrawlers() {
      let brawlers = {};
      this.battles.forEach((game) => {
        let teams = [];
        if ("teams" in game.battle) {
          teams = [...game.battle.teams[0], ...game.battle.teams[1]];
        } else {
          teams = game.battle.players;
        }
        teams.forEach((player) => {
          if (player.tag === this.tag) {
            const playerBrawler = player.brawler.name;
            if (playerBrawler in brawlers) {
              brawlers[playerBrawler] += 1;
            } else {
              brawlers[playerBrawler] = 1;
            }
            return;
          }
        });
      });
      return brawlers;
    }
  }
  
exports.PlayerModel = PlayerModel;
  