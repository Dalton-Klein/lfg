require('dotenv').config();
const Sequelize = require('sequelize');
const { sequelize } = require('../models/index');
const { getRustTilesQuery, getRocketLeagueTilesQuery } = require('../services/tiles-queries');
const { getPendingRequestUserIdsQuery, getExistingConnectionUserIdsQuery } = require('../services/social-queries');
const moment = require('moment');
const { updateUserGenInfoField } = require('../services/user-common');
/*
get tiles logic
*/
const getRustTiles = async (req, res) => {
  try {
    console.log(' ♛ A User Requested Rust Tiles ♛ ');
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
    updateUserGenInfoField(userId, 'last_seen', moment().format());
    res.status(200).send(filteredTiles);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const getRocketLeagueTiles = async (req, res) => {
  try {
    console.log(' ♛ A User Requested Rocket League Tiles ♛ ');
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
    console.log('resu??', filteredTiles, tiles.length);
    updateUserGenInfoField(userId, 'last_seen', moment().format());
    res.status(200).send(filteredTiles);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

module.exports = {
  getRustTiles,
  getRocketLeagueTiles,
};
