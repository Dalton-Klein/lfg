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

const kickSpecificMember = async (gang_id, user_id) => {
  gangsQuery = `
  delete from public.gang_roster
        where gang_id = :gang_id
          and user_id = :user_id
`;
  return await sequelize.query(gangsQuery, {
    type: Sequelize.QueryTypes.DELETE,
    replacements: {
      gang_id,
      user_id,
    },
  });
};

const removeChannel = async (channel_id) => {
  gangsQuery = `
  delete from public.gang_chats
        where id = :channel_id
`;
  return await sequelize.query(gangsQuery, {
    type: Sequelize.QueryTypes.DELETE,
    replacements: {
      channel_id,
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
      select gr.*, ros.user_id as owner_id
        from public.gang_requests gr
        join public.gang_roster ros
          on ros.gang_id = gr.gang_id 
         and ros.role_id = 1
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

const createGangRequirement = async (gang_id, user_id, description, priority_level) => {
  gangsQuery = `
  insert into public.gang_requirements (gang_id, user_id, description, priority_level, created_at, updated_at)
       values (:gang_id, :user_id, :description, :priority_level, current_timestamp, current_timestamp)
    returning id
`;
  return await sequelize.query(gangsQuery, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: {
      gang_id,
      user_id,
      description,
      priority_level,
    },
  });
};

const removeRequirement = async (requirement_id) => {
  gangsQuery = `
  delete from public.gang_requirements
        where id = :requirement_id
`;
  return await sequelize.query(gangsQuery, {
    type: Sequelize.QueryTypes.DELETE,
    replacements: {
      requirement_id,
    },
  });
};

const searchGangByGangNameQuery = async (inputString) => {
  const query = `
      select g.id
        from public.gangs g
        where g.name = :inputString
  `;
  return await sequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: {
      inputString,
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
  kickSpecificMember,
  removeChannel,
  createGangRequirement,
  removeRequirement,
  searchGangByGangNameQuery,
};
