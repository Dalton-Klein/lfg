require("dotenv").config();
const Sequelize = require("sequelize");
const { sequelize } = require("../models/index");
const { getRustTilesQuery, getRocketLeagueTilesQuery } = require("../services/tiles-queries");
const { getPendingRequestUserIdsQuery, getExistingConnectionUserIdsQuery } = require("../services/social-queries");
const moment = require("moment");
const { findRosterAvatars } = require("../controllers/gangs-controller");
/*
get tiles logic
*/
const getRustTiles = async (req, res) => {
  try {
    console.log(" ♛ A User Requested Rust Tiles ♛ ");
    const { userId, username, token } = req.body;
    const getTilesQuery = getRustTilesQuery();
    const tiles = await sequelize.query(getTilesQuery, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId,
        username,
      },
    });
    const getPendingRequestsQuery = getPendingRequestUserIdsQuery();
    let pendingIds = await sequelize.query(getPendingRequestsQuery, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId,
      },
    });
    pendingIds = pendingIds.map(({ userids }) => userids);
    const existingIdsQuery = getExistingConnectionUserIdsQuery();
    let existingIds = await sequelize.query(existingIdsQuery, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId,
      },
    });
    existingIds = existingIds.map(({ userids }) => userids);
    //Filter out tiles that the user has pending requests for
    let filteredTiles = tiles.filter((tile) => {
      return !pendingIds.includes(tile.id);
    });
    //Filter out tiles that the user is already connected with
    filteredTiles = filteredTiles.filter((tile) => {
      return !existingIds.includes(tile.id);
    });
    res.status(200).send(filteredTiles);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const getRocketLeagueTiles = async (req, res) => {
  try {
    console.log(" ♛ A User Requested Rocket League Tiles ♛ ");
    const { userId, username, token } = req.body;
    const getTilesQuery = getRocketLeagueTilesQuery();
    const tiles = await sequelize.query(getTilesQuery, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId,
        username,
      },
    });
    const getPendingRequestsQuery = getPendingRequestUserIdsQuery();
    let pendingIds = await sequelize.query(getPendingRequestsQuery, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId,
      },
    });
    pendingIds = pendingIds.map(({ userids }) => userids);
    const existingIdsQuery = getExistingConnectionUserIdsQuery();
    let existingIds = await sequelize.query(existingIdsQuery, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId,
      },
    });
    existingIds = existingIds.map(({ userids }) => userids);
    //Filter out tiles that the user has pending requests for
    let filteredTiles = tiles.filter((tile) => {
      return !pendingIds.includes(tile.id);
    });
    //Filter out tiles that the user is already connected with
    filteredTiles = filteredTiles.filter((tile) => {
      return !existingIds.includes(tile.id);
    });
    res.status(200).send(filteredTiles);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const getLFMGangTiles = async (req, res) => {
  console.log(" ♛ A User Requested Their Gangs ♛ ");
  try {
    const { user_id, game_platform_id } = req.body;
    gangsQuery = `
          select g.*
            from public.gangs g
       left join public.gang_roster r
              on g.id = r.gang_id
           where g.game_platform_id = :game_platform_id
             and r.user_id != :user_id
        group by g.id
    `;
    let foundGangs = await sequelize.query(gangsQuery, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        user_id,
        game_platform_id,
      },
    });
    foundGangs = await findRosterAvatars(foundGangs);
    res.status(200).send(foundGangs);
  } catch (err) {
    console.log("GET CHATS ERROR", err);
    res.status(500).send(`GET ERROR: ${err}`);
  }
};

module.exports = {
  getRustTiles,
  getRocketLeagueTiles,
  getLFMGangTiles,
};
