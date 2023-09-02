const { sequelize } = require("../models/index");
const Sequelize = require("sequelize");
const {
  createNotificationQuery,
  removeNotificationQuery,
  getNotificationsQuery,
  getAllNotificationsQuery,
  getLastNotificationOfTypeQuery,
} = require("../services/notifications-queries");
const { getUserInfo } = require("../services/user-common");
const emailService = require("../services/auth");
const moment = require("moment");

const saveNotification = async (userId, typeId, otherUserId) => {
  try {
    let lastNotifOfType;
    //First, clean up similar message notifications
    if (typeId === 3) {
      //before anything, check the last notification of type, for use later when we decide to send email or not (this occurs before insert)
      lastNotifOfType = await getLastNotificationOfTypeForUser(userId, typeId);
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
    let otherUserDetails = {};
    if (otherUserId > 0) {
      otherUserDetails = await getUserInfo(otherUserId);
      otherUserDetails = otherUserDetails[0];
    }
    let ownerUserDetails = await getUserInfo(userId);
    ownerUserDetails = ownerUserDetails[0];
    const _io = global._io;
    //Send Private Notifcation to owner
    const responseObject = {
      id: notificationResult[0][0].id,
      owner_id: ownerUserDetails.id,
      type_id: typeId,
      other_user_id: otherUserId,
      other_username: otherUserDetails.username ? otherUserDetails.username : undefined,
      other_user_avatar_url: otherUserDetails.avatar_url,
    };
    _io.to(`notifications-${ownerUserDetails.id}`).emit("notification", responseObject);
    //Send Public Notification to home page
    if (typeId !== 3) {
      _io.to(`notifications-general`).emit("notification-general", {
        id: notificationResult[0][0].id,
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
    //Perform check to see if they want emails
    if (ownerUserDetails.is_email_notifications) {
      //Perform check to see if we have recently sent them an email of the same type, only every 30 mins at most
      let shouldSendNotif = true;
      if (typeId === 3 && lastNotifOfType[0]) {
        const thirtyMinutesAgo = moment().subtract(30, "minutes");
        const timestampOfLastNotifMoment = moment(lastNotifOfType[0].created_at);
        if (timestampOfLastNotifMoment.isBefore(thirtyMinutesAgo)) {
          shouldSendNotif = true;
        } else {
          shouldSendNotif = false;
        }
      }
      if (shouldSendNotif) {
        emailService.sendEmail(
          { body: { email: ownerUserDetails.email } },
          "vKey",
          emailNotifIdToSubjectIdMapping[typeId],
          ownerUserDetails.username
        );
      }
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

const getLastNotificationOfTypeForUser = async (userId, typeId) => {
  try {
    const query = getLastNotificationOfTypeQuery();
    const result = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        ownerId: userId,
        typeId: typeId,
      },
    });
    return result;
  } catch (err) {
    console.log("error while getting last notification of type for user: ", err);
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
