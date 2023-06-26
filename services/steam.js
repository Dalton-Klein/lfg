const getPublicSteamGameData = async (steam_id, dynamicReplacements = {}) => {
  const apiKey = process.env.STEAM_API_KEY;
  try {
    const response = await fetch(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steam_id}`
    );
    const data = await response.json();
    const gameData = data.response;
    let formattedReturnObject = [];
    // ***NEW GAME MODIFY
    gameData.games.forEach((game) => {
      if (game.appid === 252490) {
        const playtimeHours = Math.round(game.playtime_forever / 60);
        dynamicReplacements.rust_hours = playtimeHours;
        formattedReturnObject.push({
          gameName: "rust",
          hours: playtimeHours,
        });
      } else if (game.appid === 252950) {
        const playtimeHours = Math.round(game.playtime_forever / 60);
        dynamicReplacements.rocket_league_hours = playtimeHours;
        formattedReturnObject.push({
          gameName: "rocket league",
          hours: playtimeHours,
        });
      }
    });
    return formattedReturnObject;
  } catch (error) {
    console.error("Error retrieving Steam game data:", error);
    return "Error retrieving Steam game data";
  }
};

module.exports = { getPublicSteamGameData };
