const Sequelize = require("sequelize");
const { sequelize } = require("../models/index");
const format = require("pg-format");
const {
  getUserInfo,
  updateUserGenInfoField,
  searchForUserByUsername,
  getRankProgressionStatus,
} = require("../services/user-common");
const { getEndorsementsForUser } = require("../services/endorsement-queries");
const { getPendingRequestUserIdsQuery } = require("../services/social-queries");
const { createRedemptionForUser } = require("./redeems-controller");

const getTotalUserCount = async (req, res) => {
  try {
    const { userId, token } = req.body;
    // const query = format('SELECT * FROM %I WHERE my_col = %L %s', 'my_table', 34, 'LIMIT 10');
    const query = `
      select count(*) as count from public.users;
    `;
    const reply = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
    });
    let result;
    if (reply && reply[0]) {
      result = reply[0].count;
    }
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send("POST ERROR");
  }
};

const getRankingLeaderboard = async (req, res) => {
  try {
    const { userId, token } = req.body;
    // const query = format('SELECT * FROM %I WHERE my_col = %L %s', 'my_table', 34, 'LIMIT 10');
    const query = `
        select u.username, 
               u.avatar_url, 
               r.user_id, 
               sum(r.points) as total_points
          from public.redeems r
          join public.users u
            on u.id = r.user_id
      group by u.username, u.avatar_url, user_id, r.user_id
      order by sum(r.points) desc;
    `;
    const reply = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
    });
    let result = [];
    if (reply && reply[0]) {
      let count = 0;
      reply.forEach((rec) => {
        if (count < 10) {
          result.push(rec);
          count++;
        } else if (rec.user_id === userId) {
          result.push(rec);
          count++;
        }
      });
    }
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send("POST ERROR");
  }
};

const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) throw new Error("no user id when getting user details");
    let result = await getUserInfo(userId);
    if (result && result[0]) result = result[0];
    res.status(200).send({ data: result });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting user details");
  }
};
const getUserDetailsAndConnectedStatus = async (req, res) => {
  try {
    const { originatingUserId, requestedUserId } = req.body;
    if (!requestedUserId) throw new Error("no user id when getting user details");
    let result = await getUserInfo(requestedUserId);
    if (result && result[0]) result = result[0];
    const getPendingRequestsQuery = getPendingRequestUserIdsQuery();
    let pendingIds = await sequelize.query(getPendingRequestsQuery, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId: requestedUserId,
      },
    });
    pendingIds = pendingIds.map(({ userids }) => userids);
    let existingIds = result.connections.length ? result.connections : [];
    if (!pendingIds.includes(originatingUserId) && !existingIds.includes(originatingUserId)) {
      result.showConnectForm = true;
    } else result.showConnectForm = false;
    if (existingIds.includes(originatingUserId)) {
      result.isConnected = true;
    } else result.isConnected = false;
    res.status(200).send({ data: result });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error user getting details + connected status");
  }
};

const searchForUser = async (req, res) => {
  try {
    const { inputString } = req.body;
    let result = await searchForUserByUsername(inputString);
    if (result && result[0]) result = result[0];
    res.status(200).send({ data: result });
  } catch (err) {
    console.log(err);
    res.status(500).send("POST ERROR");
  }
};

/*
Get Email Prefs For User
*/
//Currently not used but could be useful in future
const getEmailPrefs = async (userId) => {
  try {
    let query = `select is_email_marketing, is_email_notifications from public.users where id = :userId`;
    let result = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId,
      },
    });
    res.status(200).send(result);
  } catch (error) {
    console.log("Error getting email prefs", error);
    res.status(500).send("POST ERROR");
  }
};

const updateProfileField = async (req, res) => {
  try {
    const { userId, field, value } = req.body;
    // const query = format('SELECT * FROM %I WHERE my_col = %L %s', 'my_table', 34, 'LIMIT 10');
    const query = format(
      `update public.users 
          set %I = :value,
              updated_at = current_timestamp
        where id = :userId
      `,
      field
    );
    const reply = await sequelize.query(query, {
      type: Sequelize.QueryTypes.UPDATE,
      replacements: {
        userId,
        value,
      },
    });
    res.status(200).send(reply);
  } catch (err) {
    console.log(err);
    res.status(500).send("POST ERROR");
  }
};

const updateGeneralInfoField = async (req, res) => {
  try {
    const { userId, field, value } = req.body;
    const reply = await updateUserGenInfoField(userId, field, value);
    res.status(200).send(reply);
  } catch (err) {
    console.log(err);
    res.status(500).send("POST ERROR");
  }
};

const updateGameSpecificInfoField = async (req, res) => {
  try {
    const { userId, table, field, value } = req.body;
    const query = format(
      `
      update %s
         set %I = :value,
             updated_at = current_timestamp
       where user_id = :userId
    `,
      table,
      field
    );
    const reply = await sequelize.query(query, {
      type: Sequelize.QueryTypes.UPDATE,
      replacements: {
        userId,
        field,
        value,
      },
    });
    if (field === "is_published" && value === true) {
      await createRedemptionForUser(userId, 3);
    }
    res.status(200).send(reply);
  } catch (err) {
    console.log(err);
    res.status(500).send("POST ERROR");
  }
};

const getSocialDetails = async (req, res) => {
  try {
    const { fromUserId, forUserId, token } = req.body;
    // const query = format('SELECT * FROM %I WHERE my_col = %L %s', 'my_table', 34, 'LIMIT 10');
    let query = `select count(id)
         from public.connections 
        where sender = :userId
           or acceptor = :userId
    `;
    const connectionCount = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId: forUserId,
      },
    });
    query = ` select acceptor
          from public.connections 
         where sender = :userId
               union
        select sender
          from public.connections 
         where acceptor = :userId
    `;
    let connectionListFor = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId: forUserId,
      },
    });
    let connectionListFrom = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId: fromUserId,
      },
    });
    //Find number of mutuals between two unused arrays
    connectionListFor = connectionListFor.map(({ acceptor }) => acceptor);
    connectionListFrom = connectionListFrom.map(({ acceptor }) => acceptor);
    let intersection = connectionListFor.filter((e) => connectionListFrom.indexOf(e) !== -1);
    const result = {
      connections: connectionCount ? connectionCount[0].count : 0,
      mutual: intersection ? intersection.length : 0,
    };
    query = getEndorsementsForUser();
    //Get Endorsements
    const endorsementResult = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        receiverId: forUserId,
      },
    });
    result.endorsements = endorsementResult;
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send("POST ERROR");
  }
};

const deleteAccount = async (id) => {
  const query = `
      delete from users where id = :id
      delete from user_general_infos where user_id = :id
      delete from user_rust_infos where user_id = :id
      delete from user_tokens where id = :id
      delete from messages where sender = :id 
      delete from connections where sender = :id
      delete from connections where acceptor = :id
      delete from connection_requests where sender = :id
      delete from connection_requests where receiver = :id
  `;
  return await sequelize.query(query, {
    type: Sequelize.QueryTypes.DELETE,
    replacements: {
      id,
    },
  });
};

module.exports = {
  getTotalUserCount,
  getRankingLeaderboard,
  getUserDetails,
  getUserDetailsAndConnectedStatus,
  getEmailPrefs,
  updateProfileField,
  updateGeneralInfoField,
  updateGameSpecificInfoField,
  getSocialDetails,
  deleteAccount,
  searchForUser,
};
