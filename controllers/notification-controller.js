const { sequelize } = require('../models/index');
const Sequelize = require('sequelize');
const {
	createNotificationQuery,
	removeNotificationQuery,
	getNotificationsQuery,
	getAllNotificationsQuery,
} = require('../services/notifications-queries');
const { getUserInfo } = require('../services/user-common');
const emailService = require('../services/auth');

const saveNotification = async (userId, typeId, otherUserId) => {
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
		//Third, get user data for notification
		let otherUserDetails = await getUserInfo(otherUserId);
		let ownerUserDetails = await getUserInfo(userId);
		otherUserDetails = otherUserDetails[0];
		ownerUserDetails = ownerUserDetails[0];
		const _io = global._io;
		//Send Private Notifcation to owner
		_io.to(`notifications-${userId}`).emit('notification', {
			id: notificationResult.id,
			owner_id: ownerUserDetails.id,
			type_id: typeId,
			other_user_id: otherUserId,
			other_username: otherUserDetails.username,
			other_user_avatar_url: otherUserDetails.avatar_url,
		});
		//Send Public Notification to home page
		if (typeId !== 3) {
			_io.to(`notifications-general`).emit('notification', {
				id: notificationResult.id,
				owner_id: ownerUserDetails.id,
				owner_username: ownerUserDetails.username,
				owner_avatar_url: ownerUserDetails.avatar_url,
				type_id: typeId,
				other_user_id: otherUserId,
				other_username: otherUserDetails.username,
				other_user_avatar_url: otherUserDetails.avatar_url,
			});
		}
		//Send Email If User Is Opted In
		const emailNotifIdToSubjectIdMapping = {
			1: 3,
			2: 4,
			3: 5,
			4: 6,
			5: 0,
		};
		if (ownerUserDetails.is_email_notifications) {
			emailService.sendEmail(
				{ body: { email: ownerUserDetails.email } },
				'vKey',
				emailNotifIdToSubjectIdMapping[typeId],
				ownerUserDetails.username
			);
		}
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

const getNotificationsGeneral = async (req, res) => {
	try {
		const query = getAllNotificationsQuery();
		const result = await sequelize.query(query, {
			type: Sequelize.QueryTypes.SELECT,
		});
		res.status(200).send(result);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
};

module.exports = { saveNotification, getNotificationsForUser, getNotificationsGeneral };
