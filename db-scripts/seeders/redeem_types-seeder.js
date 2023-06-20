"use strinct";

const { redeem_types } = require("../../models/index");
const created_by = (updated_by = "seeder_script");
const created_at = (updated_at = Date.now());
const defaultValues = { created_by, updated_by, created_at, updated_at };

module.exports = {
  up: async ({ context: sequelize }) => {
    const transaction = await sequelize.transaction();
    const existingRecords = await sequelize.query("select id from public.redeem_types", {
      type: sequelize.QueryTypes.SELECT,
    });
    console.log("here? ", existingRecords);
    if (!existingRecords.length) {
      await redeem_types.bulkCreate(
        [
          {
            id: 1,
            name: "signup",
            description: "Awarded for signing up for the gangs platform!",
            max_redeems: 1,
            points: 1,
            ...defaultValues,
          },
          {
            id: 2,
            name: "profile complete",
            description: "Awarded for completing all fields in your general profile.",
            max_redeems: 1,
            points: 1,
            ...defaultValues,
          },
          {
            id: 3,
            name: "go public",
            description: "Awarded for publishing a game profile. Must first fill out profile in order to publish",
            max_redeems: 1,
            points: 1,
            ...defaultValues,
          },
          {
            id: 4,
            name: "gang leader",
            description: "Awarded for creating a new gang.",
            max_redeems: 2,
            points: 5,
            ...defaultValues,
          },
          {
            id: 5,
            name: "buddy up",
            description: "Awarded for adding a new friend.",
            max_redeems: 10,
            points: 3,
            ...defaultValues,
          },
          {
            id: 6,
            name: "report for duty",
            description: "Awarded for joining an existing gang (that you don't own).",
            max_redeems: 10,
            points: 3,
            ...defaultValues,
          },
          {
            id: 7,
            name: "recruiter",
            description: "Awarded for someone joining a gang that you own.",
            max_redeems: 10,
            points: 3,
            ...defaultValues,
          },
          {
            id: 8,
            name: "critic",
            description: "Awarded for leaving an endorsement on a players profile.",
            max_redeems: 10,
            points: 1,
            ...defaultValues,
          },
          {
            id: 9,
            name: "avid gamer",
            description: "Awarded at most once per day for using the gangs platform in some way.",
            max_redeems: 999999,
            points: 1,
            ...defaultValues,
          },
          {
            id: 10,
            name: "good comms",
            description: "Awarded at most once per day for sending a group or private message in the gangs platform.",
            max_redeems: 999999,
            points: 1,
            ...defaultValues,
          },
        ],
        { transaction }
      );
    } else {
      console.log("Found existing data in redeem_types table, so seeder script will not insert data.");
    }
    return await transaction.commit();
  },
  down: async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().bulkDelete("redeem_types", null, { truncate: true });
  },
};
