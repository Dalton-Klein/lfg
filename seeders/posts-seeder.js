"use strinct";

const { posts } = require("../models/index");
const created_by = (updated_by = "seeder_script");
const created_at = (updated_at = Date.now());
const defaultValues = { created_by, updated_by, created_at, updated_at };

module.exports = {
  up: async ({ context: sequelize }) => {
    const transaction = await sequelize.transaction();
    const existingRecords = await sequelize.query("select id from codelounge.public.posts", {
      type: sequelize.QueryTypes.SELECT,
    });
    if (!existingRecords.length) {
      await posts.bulkCreate(
        [
          {
            id: 1,
            owner: 1,
            content: "This is a test post222222! My story is so special. I was a wonderful child. I get fucked up on onies every night.",
            photo_url: "",
            number_votes: 4564,
            category: 1,
            topics: [1, 5],
            ...defaultValues,
          },
          {
            id: 2,
            owner: 1,
            content: "This is a test post222222!",
            photo_url: "",
            number_votes: 32,
            category: 2,
            topics: [2, 6],
            ...defaultValues,
          },
          {
            id: 3,
            owner: 1,
            content: "This is a test post111111!",
            photo_url: "",
            number_votes: 99,
            category: 3,
            topics: [7, 12, 15],
            ...defaultValues,
          },
        ],
        { transaction }
      );
    } else {
      console.log("Found existing data in posts table, so seeder script will not insert data.");
    }
    return await transaction.commit();
  },
  down: async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().bulkDelete("posts", null, { truncate: true });
  },
};
