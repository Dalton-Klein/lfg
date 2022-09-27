const { sequelize } = require('../models/index');
const Sequelize = require('sequelize');
const {
	createNotificationQuery,
	removeNotificationQuery,
	getNotificationsQuery,
} = require('../services/notifications-queries');
const { getUserInfo } = require('../services/user-common');

const saveNotification = async (req, userId, typeId, otherUserId) => {
	try {
		//First, clean up similar message notifications
		if (typeId === 3) {
			const query = removeNotificationQuery();
			await sequelize.query(query, {
				type: Sequelize.QueryTypes.DELETE,
				replacements: {
					ownerId: userId,
					typeId,
					otherUserId,
				},
			});
		}
		//Second, insert notification into notifications table
		const query = createNotificationQuery();
		const notificationResult = await sequelize.query(query, {
			type: Sequelize.QueryTypes.INSERT,
			replacements: {
				ownerId: userId,
				typeId,
				otherUserId,
			},
		});
		//Third, get other user data for notification and then send notification
		let userDetails = await getUserInfo(userId);
		userDetails = userDetails[0];
		const _io = global._io;
		_io.to(`notifications-${userId}`).emit('notification', {
			id: 0,
			owner_id: notificationResult.id,
			type_id: typeId,
			other_user_id: otherUserId,
			other_username: userDetails.username,
			other_user_avatar_url: userDetails.avatar_url,
		});
		return;
	} catch (err) {
		console.log(err);
	}
};

const getNotificationsForUser = async (req, res) => {
	try {
		const { userId, token } = req.body;
		const query = getNotificationsQuery();
		const result = await sequelize.query(query, {
			type: Sequelize.QueryTypes.SELECT,
			replacements: {
				ownerId: userId,
			},
		});
		res.status(200).send(result);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
};

module.exports = { saveNotification, getNotificationsForUser };
