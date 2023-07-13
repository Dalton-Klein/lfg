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
              select m.*, 
                     u.id as senderId, 
                     u.username, 
                     u.avatar_url, 
                     rd.rank,
                     re.count_love, 
                     re.count_thumbs_down, 
                     re.count_thumbs_up, 
                     re.count_one_hunderd,
                     re.count_fire,
                     re.count_skull
                from public.messages m
                join public.users u
                  on u.id = m.sender
           left join (
                      SELECT user_id, SUM(points) as rank
                      FROM public.redeems
                      GROUP BY user_id
                     ) rd on rd.user_id = u.id
           left join (
                      SELECT message_id, scope_id,
                            SUM(CASE WHEN type_id = 1 THEN 1 ELSE 0 END) as count_love,
                            SUM(CASE WHEN type_id = 2 THEN 1 ELSE 0 END) as count_thumbs_down,
                            SUM(CASE WHEN type_id = 3 THEN 1 ELSE 0 END) as count_thumbs_up,
                            SUM(CASE WHEN type_id = 4 THEN 1 ELSE 0 END) as count_one_hunderd,
                            SUM(CASE WHEN type_id = 5 THEN 1 ELSE 0 END) as count_fire,
                            SUM(CASE WHEN type_id = 6 THEN 1 ELSE 0 END) as count_skull
                      FROM public.reactions
                      WHERE scope_id = 1
                      GROUP BY message_id, scope_id
                      ) re ON re.message_id = m.id
                 and re.scope_id = 1
               where m.connection_id = :chatId
                 and m.is_deleted = false
            group by m.id, 
                     u.id, 
                     u.username, 
                     u.avatar_url, 
                     rd.rank, 
                     re.count_love, 
                     re.count_thumbs_down, 
                     re.count_thumbs_up, 
                     re.count_one_hunderd,
                     re.count_fire,
                     re.count_skull
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
              select gm.*, 
                     u.id as senderId, 
                     u.username, 
                     u.avatar_url, 
                     rd.rank,
                     re.count_love, 
                     re.count_thumbs_down, 
                     re.count_thumbs_up, 
                     re.count_one_hunderd,
                     re.count_fire,
                     re.count_skull
              from public.gang_messages gm
                join public.users u
                  on u.id = gm.sender
          left join (
                      SELECT user_id, 
                             SUM(points) as rank
                        FROM public.redeems
                    GROUP BY user_id
                    ) rd on rd.user_id = u.id
          left join (
                      SELECT message_id, 
                             scope_id,
                             SUM(CASE WHEN type_id = 1 THEN 1 ELSE 0 END) as count_love,
                             SUM(CASE WHEN type_id = 2 THEN 1 ELSE 0 END) as count_thumbs_down,
                             SUM(CASE WHEN type_id = 3 THEN 1 ELSE 0 END) as count_thumbs_up,
                             SUM(CASE WHEN type_id = 4 THEN 1 ELSE 0 END) as count_one_hunderd,
                             SUM(CASE WHEN type_id = 5 THEN 1 ELSE 0 END) as count_fire,
                             SUM(CASE WHEN type_id = 6 THEN 1 ELSE 0 END) as count_skull
                        FROM public.reactions
                       WHERE scope_id = 2
                    GROUP BY message_id, scope_id
                    ) re ON re.message_id = gm.id
               where gm.chat_id = :channelId
                 and gm.is_deleted = false
            group by gm.id, 
                     u.id, 
                     u.username, 
                     u.avatar_url, 
                     rd.rank, 
                     re.count_love, 
                     re.count_thumbs_down, 
                     re.count_thumbs_up, 
                     re.count_one_hunderd,
                     re.count_fire,
                     re.count_skull
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

const addMessageReaction = async (ownerId, reactionTypeId, messageId, messageScopeId) => {
  // The following logic will try to add a new reaction, UNLESS...
  // The user has already added that specific emote to that message,
  // In which case we will remove the reaction
  try {
    const doesReactionAlreadyExist = await checkReactionExists(ownerId, reactionTypeId, messageId, messageScopeId);
    if (doesReactionAlreadyExist && doesReactionAlreadyExist.length > 0) {
      const deleteResult = await removeReactionRecord(ownerId, reactionTypeId, messageId, messageScopeId);
      if (deleteResult) {
        return "removed";
      } else {
        return "error";
      }
    } else {
      const insertResult = await createReactionRecord(ownerId, reactionTypeId, messageId, messageScopeId);
      if (insertResult && insertResult[0] && insertResult[0][0]?.id) {
        return "added";
      } else {
        return "error";
      }
    }
  } catch (error) {
    console.log(`Add reaction error: ${error}`);
    return "error";
  }
};

const removeReactionRecord = async (ownerId, reactionTypeId, messageId, messageScopeId) => {
  const query = `
    delete from public.reactions 
          where scope_id = :messageScopeId
            and message_id = :messageId
            and type_id = :reactionTypeId
            and owner_id = :ownerId
  `;
  return await sequelize.query(query, {
    type: Sequelize.QueryTypes.DELETE,
    replacements: {
      messageId,
      messageScopeId,
      reactionTypeId,
      ownerId,
    },
  });
};

const createReactionRecord = async (ownerId, reactionTypeId, messageId, messageScopeId) => {
  const query = `
    insert into public.reactions (scope_id,
                                    message_id,
                                    type_id,
                                    owner_id,
                                    created_at,
                                    updated_at) 
                            values (:messageScopeId, 
                                    :messageId, 
                                    :reactionTypeId, 
                                    :ownerId,
                                    current_timestamp, 
                                    current_timestamp)
                              returning id;
  `;
  return await sequelize.query(query, {
    type: Sequelize.QueryTypes.INSERT,
    replacements: {
      messageId,
      messageScopeId,
      reactionTypeId,
      ownerId,
    },
  });
};

const checkReactionExists = async (ownerId, reactionTypeId, messageId, messageScopeId) => {
  const query = `
    select * from public.reactions r
     where r.scope_id = :messageScopeId
       and r.message_id = :messageId
       and r.type_id = :reactionTypeId
       and r.owner_id = :ownerId
  `;
  return await sequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: {
      messageId,
      messageScopeId,
      reactionTypeId,
      ownerId,
    },
  });
};

module.exports = {
  saveMessage,
  saveGangMessage,
  getChatHistoryForUser,
  getChatHistoryForGang,
  softDeleteMessage,
  addMessageReaction,
};
