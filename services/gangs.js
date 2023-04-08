const { async } = require("rxjs");
const { sequelize } = require("../models/index");
const Sequelize = require("sequelize");

const createGangRecord = async (gang) => {
  gangsQuery = `
  insert into public.gangs (name, about, avatar_url, chat_platform_id, game_platform_id, is_public, is_published, created_at, updated_at)
       values (:name, :about, :avatar_url, :chat_platform_id, :game_platform_id, :is_public, :is_published, current_timestamp, current_timestamp)
    returning token
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

const createGangChannel = async (gangId, name, privacy_level, is_voice) => {
  gangsQuery = `
  insert into public.gang_chats (gang_id, name, privacy_level, is_voice, created_at, updated_at)
       values (:gang_id, :name, :privacy_level, :is_voice, current_timestamp, current_timestamp)
    returning token
`;
  resultObject.gangResult = await sequelize.query(gangsQuery, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: {
      gang_id,
      name,
      privacy_level,
      is_voice,
    },
  });
};

const createGangRosterRecord = async (gangId, userId) => {};

module.exports = {
  createGangRecord,
  createGangDefaultChannels,
  createGangChannel,
  createGangRosterRecord,
};
