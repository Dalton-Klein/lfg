const db = require("../models/index");
const { sequelize } = require("../models/index");
const Sequelize = require("sequelize");
const { updateConnectionTimestamp, getConnectionDetails } = require("./connections-controller");
const { updateGangChannelTimestamp } = require("../services/gangs");
const { saveNotification } = require("./notification-controller");
const { createRedemptionForUser } = require("./redeems-controller");

const saveMessage = async (connectionId, senderId, content, isImage, timestamp) => {
  try {
    connectionId = parseInt(connectionId);
    //First, insert message into messages table
    query = `
          insert into public.messages ( connection_id,
                                        sender,
                                        content,
                                        is_image,
                                        created_at,
                                        updated_at) 
              values (:connection_id, 
                      :senderId, 
                      :content, 
                      :isImage,
                      :created_at, 
                      :updated_at)
            returning id;
    `;
    const result = await sequelize.query(query, {
      type: Sequelize.QueryTypes.INSERT,
      replacements: {
        connection_id: connectionId,
        senderId,
        content,
        isImage,
        created_at: timestamp,
        updated_at: timestamp,
      },
    });
    await createRedemptionForUser(senderId, 9);
    // For DMS, send notification to receiver of DM if not a public chat (1, 2, 3)
    if (![-1, -2, -3, 1, 2, 3].includes(connectionId)) {
      //Update connection updated at, so convos can be sorted by recency
      await updateConnectionTimestamp(connectionId);
      let connectionResult = await getConnectionDetails(connectionId);
      connectionResult = connectionResult[0];
      await saveNotification(
        senderId === connectionResult.sender ? connectionResult.acceptor : connectionResult.sender,
        3,
        senderId !== connectionResult.sender ? connectionResult.acceptor : connectionResult.sender
      );
    }
    const messageId = result[0][0].id;
    return messageId;
  } catch (err) {
    console.log(err);
  }
};

const saveGangMessage = async (channelId, senderId, content, isImage, timestamp) => {
  try {
    //First, insert message into messages table
    query = `
          insert into public.gang_messages ( chat_id,
                                        sender,
                                        content,
                                        is_image,
                                        created_at,
                                        updated_at) 
              values (:chat_id, 
                      :senderId, 
                      :content, 
                      :isImage,
                      :created_at, 
                      :updated_at)
            returning id;
    `;
    const result = await sequelize.query(query, {
      type: Sequelize.QueryTypes.INSERT,
      replacements: {
        chat_id: channelId,
        senderId,
        content,
        isImage,
        created_at: timestamp,
        updated_at: timestamp,
      },
    });
    const messageId = result[0][0].id;
    //Update connection updated at, so convos can be sorted by recency
    await updateGangChannelTimestamp(channelId);
    await createRedemptionForUser(senderId, 9);
    return messageId;
  } catch (err) {
    console.log(err);
  }
};

const getChatHistoryForUser = async (req, res) => {
  console.log(" ♛ A User Requested Chat History ♛ ");
  try {
    const { chatId } = req.body;
    query = `
              select m.*, u.id as senderId, u.username, u.avatar_url, sum(rd.points) as rank,
                     SUM(CASE WHEN re.type_id = 1 THEN 1 ELSE 0 END) as love_count,
                     SUM(CASE WHEN re.type_id = 2 THEN 1 ELSE 0 END) as thumbs_down_count,
                     SUM(CASE WHEN re.type_id = 3 THEN 1 ELSE 0 END) as thumbs_up_count,
                     SUM(CASE WHEN re.type_id = 3 THEN 1 ELSE 0 END) as one_hunderd_count  
                from public.messages m
                join public.users u
                  on u.id = m.sender
           left join public.redeems rd
                  on rd.user_id = u.id
           left join public.reactions re
                  on re.message_id = m.id
                 and re.scope_id = 1
               where m.connection_id = :chatId
                 and m.is_deleted = false
            group by m.id, u.id, u.username, u.avatar_url
            order by m.created_at asc
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
      chat.senderId = chat.senderid;
      delete chat.senderid;
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
              select gm.*, u.id as senderId, u.username, u.avatar_url, sum(rd.points) as rank,
                     SUM(CASE WHEN re.type_id = 1 THEN 1 ELSE 0 END) as love_count,
                     SUM(CASE WHEN re.type_id = 2 THEN 1 ELSE 0 END) as thumbs_down_count,
                     SUM(CASE WHEN re.type_id = 3 THEN 1 ELSE 0 END) as thumbs_up_count,
                     SUM(CASE WHEN re.type_id = 3 THEN 1 ELSE 0 END) as one_hunderd_count  
              from public.gang_messages gm
                join public.users u
                  on u.id = gm.sender
           left join public.redeems rd
                  on rd.user_id = u.id
           left join public.reactions re
                  on re.message_id = gm.id
                 and re.scope_id = 2
               where gm.chat_id = :channelId
                 and gm.is_deleted = false
            group by gm.id, u.id, u.username, u.avatar_url
            order by gm.created_at asc
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
      chat.senderId = chat.senderid;
      delete chat.senderid;
      delete chat.content;
    });
    res.status(200).send(foundChat);
  } catch (err) {
    console.log("GET GANG CHAT ERROR", err);
    res.status(500).send(`GET ERROR: ${err}`);
  }
};

const softDeleteMessage = async (req, res) => {
  console.log(" ♛ A User Requested To Remove Message ♛ ");
  try {
    let query = "";
    const { messageId, isGangMessage } = req.body;
    let tableName = isGangMessage ? "gang_messages" : "messages";
    query = `
              update public.${tableName} m
                 set is_deleted = true
               where m.id = :messageId
            `;
    const result = await sequelize.query(query, {
      type: Sequelize.QueryTypes.UPDATE,
      replacements: {
        messageId,
      },
    });
    res.status(200).send(result);
  } catch (err) {
    console.log("GET CHATS ERROR", err);
    res.status(500).send(`GET ERROR: ${err}`);
  }
};

module.exports = {
  saveMessage,
  saveGangMessage,
  getChatHistoryForUser,
  getChatHistoryForGang,
  softDeleteMessage,
};
