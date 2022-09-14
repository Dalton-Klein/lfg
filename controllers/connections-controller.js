require('dotenv').config();
const Sequelize = require('sequelize');
const { sequelize } = require('../models/index');
const {
	getConnectionsForUserQuerySenders,
	getConnectionsForUserQueryAcceptors,
	getIncomingPendingConnectionsForUserQuery,
	getOutgoingPendingConnectionsForUserQuery,
	getConnectionInsertQuery,
	removePendingConnectionQuery,
} = require('../services/connections-queries');

/*
get existing connections logic
*/
const getConnectionsForUser = async (req, res) => {
	try {
		console.log(' ♛ A User Requested Their Connections ♛ ');
		const { userId, token } = req.body;
		let query;
		query = getConnectionsForUserQuerySenders();
		const senderConnections = await sequelize.query(query, {
			type: Sequelize.QueryTypes.SELECT,
			replacements: {
				userId,
			},
		});
		query = getConnectionsForUserQueryAcceptors();
		const acceptorConnections = await sequelize.query(query, {
			type: Sequelize.QueryTypes.SELECT,
			replacements: {
				userId,
			},
		});
		const connections = acceptorConnections.concat(senderConnections);
		res.status(200).send(connections);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
};

const acceptConnectionRequest = async (req, res) => {
	const transaction = await sequelize.transaction();
	try {
		const { senderId, acceptorId, platform, pendingId } = req.body;
		console.log('accept connection req body: ', req.body);
		const connectionInsertQuery = getConnectionInsertQuery();
		const connectionInsertResult = await sequelize.query(connectionInsertQuery, {
			type: Sequelize.QueryTypes.INSERT,
			replacements: {
				senderId,
				acceptorId,
				platform,
			},
			transaction,
		});
		console.log('insert result: ', connectionInsertResult);
		const pendingDeletionQuery = removePendingConnectionQuery();
		const pendingDeletionResult = await sequelize.query(pendingDeletionQuery, {
			type: Sequelize.QueryTypes.INSERT,
			replacements: {
				id: pendingId,
			},
			transaction,
		});
		console.log('pending delete result: ', pendingDeletionResult);
		transaction.commit();
		res.status(200).send(connectionInsertResult);
	} catch (err) {
		console.log(err);
		transaction.rollback();
		res.status(500).send('POST ERROR');
	}
};

/*
get pending connections logic
*/
const getPendingConnectionsForUser = async (req, res) => {
	try {
		console.log(' ♛ A User Requested Their Pending Connections ♛ ');
		const { userId, token } = req.body;
		let query;
		query = getIncomingPendingConnectionsForUserQuery();
		const incmoingConnections = await sequelize.query(query, {
			type: Sequelize.QueryTypes.SELECT,
			replacements: {
				userId,
			},
		});
		query = getOutgoingPendingConnectionsForUserQuery();
		const outgoingConnections = await sequelize.query(query, {
			type: Sequelize.QueryTypes.SELECT,
			replacements: {
				userId,
			},
		});
		res.status(200).send({ incoming: incmoingConnections, outgoing: outgoingConnections });
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
};

module.exports = {
	acceptConnectionRequest,
	getConnectionsForUser,
	getPendingConnectionsForUser,
};
