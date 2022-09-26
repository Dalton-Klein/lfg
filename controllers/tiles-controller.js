require('dotenv').config();
const Sequelize = require('sequelize');
const { sequelize } = require('../models/index');
const { getRustTilesQuery } = require('../services/tiles-queries');
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

const createRustTile = async (req, res) => {
	try {
		const { owner, content, category, topics } = req.body.post;
		let topicsColumnQueryString = '';
		let topicsValueQueryString = '';
		if (topics.length) {
			topicsValueQueryString += `array [`;
			topicsColumnQueryString = 'topics, ';
			req.body.post.topics.forEach((topicId) => {
				topicsValueQueryString += `${topicId}, `;
			});
			topicsValueQueryString = topicsValueQueryString.substring(0, topicsValueQueryString.length - 2);
			topicsValueQueryString += '], ';
		}
		const reply = await await sequelize.query(
			`
      insert into posts (owner, content, categories, ${topicsColumnQueryString} number_votes, created_at, updated_at)
      values (:owner, :content, :categories, ${topicsValueQueryString} :number_votes, now(), now())
      `,
			{
				type: Sequelize.QueryTypes.INSERT,
				replacements: {
					owner,
					content,
					categories: category,
					number_votes: 0,
					created_at: `${Date.now()}`,
					updated_at: `${Date.now()}`,
				},
			}
		);
		res.status(200).send(reply);
	} catch (err) {
		console.log(err);
		res.status(500).send('POST ERROR');
	}
};

module.exports = {
	getRustTiles,
	createRustTile,
};
