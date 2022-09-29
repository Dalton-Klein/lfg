const { sequelize } = require("../models/index");
const Sequelize = require("sequelize");
const {
  createNotificationQuery,
  removeNotificationQuery,
  getNotificationsQuery,
  getAllNotificationsQuery,
} = require("../services/notifications-queries");
const { getUserInfo } = require("../services/user-common");

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
    //Third, get user data for notification
    let otherUserDetails = await getUserInfo(otherUserId);
    let ownerUserDetails = await getUserInfo(ownerId);
    otherUserDetails = otherUserDetails[0];
    const _io = global._io;
    //Send Private Notifcation to owner
    _io.to(`notifications-${userId}`).emit("notification", {
      id: 0,
      owner_id: notificationResult.id,
      type_id: typeId,
      other_user_id: otherUserId,
      other_username: otherUserDetails.username,
      other_user_avatar_url: otherUserDetails.avatar_url,
    });
    //Send Public Notification to home page
    _io.to(`notifications-general`).emit("notification", {
      id: 0,
      owner_id: notificationResult.id,
      owner_username: ownerUserDetails.username,
      owner_avatar_url: ownerUserDetails.avatar_url,
      type_id: typeId,
      other_user_id: otherUserId,
      other_username: otherUserDetails.username,
      other_user_avatar_url: otherUserDetails.avatar_url,
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
