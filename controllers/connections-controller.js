require("dotenv").config();
const Sequelize = require("sequelize");
const { sequelize } = require("../models/index");
const {
  getConnectionsForUserQuerySenders,
  getConnectionsForUserQueryAcceptors,
  getIncomingPendingConnectionsForUserQuery,
  getOutgoingPendingConnectionsForUserQuery,
  getConnectionInsertQuery,
  removePendingConnectionQuery,
} = require("../services/connections-queries");
const moment = require("moment");
const { updateUserGenInfoField } = require("../services/user-common");
const { saveNotification } = require("./notification-controller");

/*
send connection request logic
*/
const sendConnectionRequest = async (req, res) => {
  try {
    const { fromUserId, forUserId, platform, connectionText, token } = req.body;
    let query = `
      insert into public.connection_requests  (sender, receiver, platform, message, created_at, updated_at)
      values (:sender, :receiver, :platform, :message, current_timestamp, current_timestamp)
    `;
    const connectionInsertResult = await sequelize.query(query, {
      type: Sequelize.QueryTypes.INSERT,
      replacements: {
        sender: fromUserId,
        receiver: forUserId,
        message: connectionText,
        platform,
      },
    });
    const result = {
      status: "success",
      data: "created connection request",
    };
    saveNotification(forUserId, 1, fromUserId);
    updateUserGenInfoField(fromUserId, "last_seen", moment().format());
    if (connectionInsertResult) res.status(200).send(result);
    else throw new Error("Failed to create connection request");
  } catch (err) {
    console.log(err);
    res.status(500).send("POST ERROR");
  }
};
/*
get existing connections logic
*/
const getConnectionsForUser = async (req, res) => {
  try {
    console.log(" ♛ A User Requested Their Connections ♛ ");
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
    //Concat connection results for acceptors and senders
    let connections = acceptorConnections.concat(senderConnections);
    //Sort connection based on updated_at, which is kept up to date each time a message is sent
    connections = connections.sort((a, b) => (a.updated_at > b.updated_at ? -1 : 1));
    await updateUserGenInfoField(userId, "last_seen", moment().format());
    res.status(200).send(connections);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

/*
get a single connection logic
*/
const getConnectionDetails = async (connectionId) => {
  try {
    let query = `select * from public.connections where id = :connectionId`;
    const result = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        connectionId,
      },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

const acceptConnectionRequest = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { senderId, acceptorId, platform, pendingId } = req.body;
    const connectionInsertQuery = getConnectionInsertQuery();
    //Insert connection record
    const connectionInsertResult = await sequelize.query(connectionInsertQuery, {
      type: Sequelize.QueryTypes.INSERT,
      replacements: {
        senderId,
        acceptorId,
        platform,
      },
      transaction,
    });
    const pendingDeletionQuery = removePendingConnectionQuery();
    //Remove pending connection now that connection record created
    await sequelize.query(pendingDeletionQuery, {
      type: Sequelize.QueryTypes.INSERT,
      replacements: {
        id: pendingId,
      },
      transaction,
    });
    saveNotification(senderId, 2, acceptorId);
    updateUserGenInfoField(acceptorId, "last_seen", moment().format());
    transaction.commit();
    res.status(200).send(connectionInsertResult);
  } catch (err) {
    console.log(err);
    transaction.rollback();
    res.status(500).send("POST ERROR");
  }
};

/*
get pending connections logic
*/
const getPendingConnectionsForUser = async (req, res) => {
  try {
    console.log(" ♛ A User Requested Their Pending Connections ♛ ");
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

const updateConnectionTimestamp = async (connectionId) => {
  try {
    let query = `
        update public.connections
              set updated_at = current_timestamp
            where id = :connectionId
    `;
    const updateResult = await sequelize.query(query, {
      type: Sequelize.QueryTypes.UPDATE,
      replacements: {
        connectionId,
      },
    });
    return updateResult;
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

module.exports = {
  sendConnectionRequest,
  acceptConnectionRequest,
  getConnectionsForUser,
  getConnectionDetails,
  getPendingConnectionsForUser,
  updateConnectionTimestamp,
};
