const db = require("../models/index");
const { sequelize } = require("../models/index");
const Sequelize = require("sequelize");
const { updateConnectionTimestamp, getConnectionDetails } = require("./connections-controller");
const { updateUserGenInfoField } = require("../services/user-common");
const { updateGangChannelTimestamp } = require("../services/gangs");
const moment = require("moment");
const { saveNotification } = require("./notification-controller");

const saveMessage = async (connectionId, senderId, content, timestamp) => {
  try {
    //First, insert message into messages table
    query = `
          insert into public.messages ( connection_id,
                                        sender,
                                        content,
                                        created_at,
                                        updated_at) 
              values (:connection_id, 
                      :senderId, 
                      :content, 
                      :created_at, 
                      :updated_at)
    `;
    await sequelize.query(query, {
      type: Sequelize.QueryTypes.INSERT,
      replacements: {
        connection_id: connectionId,
        senderId,
        content,
        created_at: timestamp,
        updated_at: timestamp,
      },
    });
    //Update connection updated at, so convos can be sorted by recency
    await updateConnectionTimestamp(connectionId);
    // For DMS, send notification to receiver of DM if not a public chat (1, 2, 3)
    if (![1, 2, 3].includes(connectionId)) {
      let connectionResult = await getConnectionDetails(connectionId);
      connectionResult = connectionResult[0];
      await saveNotification(
        senderId === connectionResult.sender ? connectionResult.acceptor : connectionResult.sender,
        3,
        senderId !== connectionResult.sender ? connectionResult.acceptor : connectionResult.sender
      );
    }
    await updateUserGenInfoField(senderId, "last_seen", moment().format());
    return;
  } catch (err) {
    console.log(err);
  }
};

const saveGangMessage = async (channelId, senderId, content, timestamp) => {
  try {
    //First, insert message into messages table
    query = `
          insert into public.gang_messages ( chat_id,
                                        sender,
                                        content,
                                        created_at,
                                        updated_at) 
              values (:chat_id, 
                      :senderId, 
                      :content, 
                      :created_at, 
                      :updated_at)
    `;
    await sequelize.query(query, {
      type: Sequelize.QueryTypes.INSERT,
      replacements: {
        chat_id: channelId,
        senderId,
        content,
        created_at: timestamp,
        updated_at: timestamp,
      },
    });
    //Update connection updated at, so convos can be sorted by recency
    await updateGangChannelTimestamp(channelId);
    await updateUserGenInfoField(senderId, "last_seen", moment().format());
    return;
  } catch (err) {
    console.log(err);
  }
};

const getChatHistoryForUser = async (req, res) => {
  console.log(" ♛ A User Requested Chat History ♛ ");
  try {
    const { chatId } = req.body;
    query = `
              select m.*, u.username 
                from public.messages m
                join public.users u
                  on u.id = m.sender
               where m.connection_id = :chatId
            `;
    const foundChat = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        chatId,
      },
    });
    foundChat.forEach((chat) => {
      chat.message = chat.content;
      chat.sender = chat.username;
      delete chat.content;
    });
    res.status(200).send(foundChat);
  } catch (err) {
    console.log("GET CHATS ERROR", err);
    res.status(500).send(`GET ERROR: ${err}`);
  }
};

const getChatHistoryForGang = async (req, res) => {
  console.log(" ♛ A User Requested Gang Chat History ♛ ");
  try {
    const { channelId } = req.body;
    query = `
              select gm.*, u.username 
                from public.gang_messages gm
                join public.users u
                  on u.id = gm.sender
               where gm.chat_id = :channelId
            `;
    const foundChat = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        channelId,
      },
    });
    foundChat.forEach((chat) => {
      chat.message = chat.content;
      chat.sender = chat.username;
      delete chat.content;
    });
    res.status(200).send(foundChat);
  } catch (err) {
    console.log("GET GANG CHAT ERROR", err);
    res.status(500).send(`GET ERROR: ${err}`);
  }
};

module.exports = {
  saveMessage,
  saveGangMessage,
  getChatHistoryForUser,
  getChatHistoryForGang,
};
