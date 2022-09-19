"use strinct";

const { user_general_infos } = require("../models/index");
const created_by = (updated_by = "seeder_script");
const created_at = (updated_at = Date.now());
const defaultValues = { created_by, updated_by, created_at, updated_at };

module.exports = {
  up: async ({ context: sequelize }) => {
    const transaction = await sequelize.transaction();
    const existingRecords = await sequelize.query("select id from public.user_general_infos", {
      type: sequelize.QueryTypes.SELECT,
    });
    if (!existingRecords.length) {
      await user_general_infos.bulkCreate(
        [
          {
            id: 1,
            user_id: 1,
            about: "I'm the ceo bitch.",
            age: 28,
            gender: 1,
            region: 1,
            languages: "english",
            preferred_platform: 1,
            discord: "dklein#5961",
            last_seen: new Date(),
            ...defaultValues,
          },
          {
            id: 2,
            user_id: 2,
            about: "I represent the liberal agenda!",
            age: 25,
            gender: 2,
            region: 1,
            languages: "english",
            preferred_platform: 1,
            discord: "Malizik#8720",
            last_seen: new Date(),
            ...defaultValues,
          },
          {
            id: 3,
            user_id: 3,
            about: "I play way way way way way too much league and car soccar.",
            age: 25,
            gender: 1,
            region: 2,
            languages: "english",
            preferred_platform: 3,
            discord: "bigmaj64#7803",
            xbox: "PureNightDream64",
            last_seen: new Date(),
            ...defaultValues,
          },
          {
            id: 4,
            user_id: 4,
            about: "I'm just the middle child who somewhat plays fortnite. Only plays to feel like the pick me girl.",
            age: 21,
            gender: 2,
            region: 1,
            languages: "english",
            preferred_platform: 1,
            discord: "lolo#7584",
            last_seen: new Date(),
            ...defaultValues,
          },
          {
            id: 5,
            user_id: 5,
            about: "I'm the spoiled baby of the bunch. Too cool to game.",
            age: 19,
            gender: 2,
            region: 2,
            languages: "english",
            preferred_platform: 1,
            discord: "ashley#3425",
            last_seen: new Date(),
            ...defaultValues,
          },
          {
            id: 6,
            user_id: 6,
            about: "Just a test account here, nothing to see. ",
            age: 17,
            gender: 2,
            region: 2,
            languages: "english",
            preferred_platform: 1,
            discord: "tiffany#1234",
            last_seen: new Date(),
            ...defaultValues,
          },
        ],
        { transaction }
      );
    } else {
      console.log("Found existing data in user_general_infos table, so seeder script will not insert data.");
    }
    return await transaction.commit();
  },
  down: async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().bulkDelete("user_general_infos", null, { truncate: true });
  },
};
