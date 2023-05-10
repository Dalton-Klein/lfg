const { async } = require("rxjs");
const { sequelize } = require("../models/index");
const Sequelize = require("sequelize");

const createGangRecord = async (gang) => {
  gangsQuery = `
  insert into public.gangs (name, about, avatar_url, chat_platform_id, game_platform_id, is_public, is_published, created_at, updated_at)
       values (:name, :about, :avatar_url, :chat_platform_id, :game_platform_id, :is_public, :is_published, current_timestamp, current_timestamp)
    returning id
`;
  return await sequelize.query(gangsQuery, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: {
      name: gang.name,
      about: gang.about,
      avatar_url: gang.avatar_url,
      chat_platform_id: gang.chat_platform_id,
      game_platform_id: gang.game_platform_id,
      is_public: gang.is_public,
      is_published: true,
    },
  });
};

const createGangDefaultChannels = async (gangId) => {
  await createGangChannel(gangId, "general", 5, false);
  await createGangChannel(gangId, "voice", 5, true);
  return;
};

const createGangChannel = async (gang_id, name, privacy_level, is_voice) => {
  gangsQuery = `
  insert into public.gang_chats (gang_id, name, privacy_level, is_voice, created_at, updated_at)
       values (:gang_id, :name, :privacy_level, :is_voice, current_timestamp, current_timestamp)
    returning id
`;
  return await sequelize.query(gangsQuery, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: {
      gang_id,
      name,
      privacy_level,
      is_voice,
    },
  });
};

const updateGangChannelField = async (req, res) => {
  try {
    const { channelId, field, value } = req.body;
    const reply = await updateGangChannelFieldQuery(channelId, field, value);
    res.status(200).send(reply);
  } catch (err) {
    console.log(err);
    res.status(500).send("Update Gang Field ERROR");
  }
};

const updateGangChannelFieldQuery = async (gangId, field, value) => {
  const query = format(
    `
    update public.gang_chats
      set %I = :value,
          updated_at = current_timestamp
    where id = :gangId
  `,
    field
  );
  const result = await sequelize.query(query, {
    type: Sequelize.QueryTypes.UPDATE,
    replacements: {
      gangId,
      field,
      value,
    },
  });
  return result;
};

const updateGangChannelTimestamp = async (channelId) => {
  try {
    let query = `
        update public.gang_chats
              set updated_at = current_timestamp
            where id = :channelId
    `;
    const updateResult = await sequelize.query(query, {
      type: Sequelize.QueryTypes.UPDATE,
      replacements: {
        channelId,
      },
    });
    return updateResult;
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const createGangRosterRecord = async (gang_id, user_id, role_id) => {
  gangsQuery = `
  insert into public.gang_roster (gang_id, user_id, role_id, created_at, updated_at)
       values (:gang_id, :user_id, :role_id, current_timestamp, current_timestamp)
    returning id
`;
  return await sequelize.query(gangsQuery, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: {
      gang_id,
      user_id,
      role_id,
    },
  });
};

const createGangRequestRecord = async (gang_id, user_id, is_user_asking_to_join) => {
  gangsQuery = `
  insert into public.gang_requests (gang_id, user_id, is_user_asking_to_join, created_at, updated_at)
       values (:gang_id, :user_id, :is_user_asking_to_join, current_timestamp, current_timestamp)
    returning id
`;
  return await sequelize.query(gangsQuery, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: {
      gang_id,
      user_id,
      is_user_asking_to_join,
    },
  });
};

const checkGangRequestStatusByUserId = async (user_id, gang_id) => {
  gangsQuery = `
    select * 
      from public.gang_requests gr
     where gr.gang_id = :gang_id
       and gr.user_id = :user_id
  
`;
  return await sequelize.query(gangsQuery, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: {
      gang_id,
      user_id,
    },
  });
};

const checkIfUserIsInGang = async (user_id, gang_id) => {
  gangsQuery = `
    select * 
      from public.gang_roster gr
     where gr.gang_id = :gang_id
       and gr.user_id = :user_id
`;
  return await sequelize.query(gangsQuery, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: {
      gang_id,
      user_id,
    },
  });
};
const checkGangRequestStatusByRequestId = async (request_id) => {
  gangsQuery = `
    select * 
      from public.gang_requests gr
     where gr.id = :request_id
  
`;
  return await sequelize.query(gangsQuery, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: {
      request_id,
    },
  });
};

const deleteGangRequestRecord = async (id) => {
  const query = `
      delete from gang_requests where id = :id
  `;
  return await sequelize.query(query, {
    type: Sequelize.QueryTypes.DELETE,
    replacements: {
      id,
    },
  });
};

module.exports = {
  createGangRecord,
  createGangDefaultChannels,
  createGangChannel,
  updateGangChannelField,
  updateGangChannelTimestamp,
  createGangRosterRecord,
  createGangRequestRecord,
  checkGangRequestStatusByUserId,
  checkIfUserIsInGang,
  checkGangRequestStatusByRequestId,
  deleteGangRequestRecord,
};
