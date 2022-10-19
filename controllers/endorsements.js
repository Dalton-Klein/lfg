const { sequelize } = require('../models/index');
const Sequelize = require('sequelize');
const { removeEndorsementQuery, createEndoresementQuery } = require('../services/endorsements-queries');
const { saveNotification } = require('./notification-controller');

const addOrRemoveEndorsement = async (typeId, senderId, receiverId, value) => {
  try {
    //First, clean up similar endorsements
    const query = removeEndorsementQuery();
    await sequelize.query(query, {
      type: Sequelize.QueryTypes.DELETE,
      replacements: {
        typeId,
        senderId,
        receiverId,
      },
    });
    //Second, insert endorsement into endorsements table as long as value isn't neutral (0)
    let endorsementResult;
    if (value !== 0) {
      const query = createEndoresementQuery();
      endorsementResult = await sequelize.query(query, {
        type: Sequelize.QueryTypes.INSERT,
        replacements: {
          typeId,
          senderId,
          receiverId,
          value,
        },
      });
    }
    //Third, send receiver a notification
    await saveNotification(receiverId, 5, senderId);
    //Finally, return result
    return endorsementResult ? { status: 'success' } : { status: 'error' };
  } catch (err) {
    console.log(err);
  }
};

module.exports = { addOrRemoveEndorsement };
