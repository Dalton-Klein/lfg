"use strinct";
console.log("Startup script running... ");
const { sequelize } = require("../models");
const { Umzug, SequelizeStorage } = require("umzug");

const deploySeeders = async () => {
  const seeder = new Umzug({
    migrations: {
      glob: ["../seeders/*.js", { cwd: __dirname }],
    },
    context: sequelize,
    storage: new SequelizeStorage({
      sequelize,
      schema: "public",
      modelName: "sequelize_data",
    }),
    logger: console,
  });
  await seeder.up();
};

const main = async () => {
  try {
    // await deployMigrations();
    await deploySeeders();
  } catch (error) {
    throw `${error}`;
  }
};

module.exports = {
  main,
};
