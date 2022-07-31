"use strinct";

const { topics } = require("../models/index");
const created_by = (updated_by = "seeder_script");
const created_at = (updated_at = Date.now());
const defaultValues = { created_by, updated_by, created_at, updated_at };

module.exports = {
  up: async ({ context: sequelize }) => {
    const transaction = await sequelize.transaction();
    const existingRecords = await sequelize.query("select id from lfg.public.topics", {
      type: sequelize.QueryTypes.SELECT,
    });
    if (!existingRecords.length) {
      await topics.bulkCreate(
        [
          {
            id: 1,
            name: "javascript",
            color: "aliceblue",
            ...defaultValues,
          },
          {
            name: "angular",
            color: "antiquewhite",
            ...defaultValues,
          },
          {
            name: "python",
            color: "aqua",
            ...defaultValues,
          },
          {
            name: "react",
            color: "aquamarine",
            ...defaultValues,
          },
          {
            name: "laravel",
            color: "azure",
            ...defaultValues,
          },
          {
            name: "pandas",
            color: "beige	",
            ...defaultValues,
          },
          {
            name: "typescript",
            color: "bisque",
            ...defaultValues,
          },
          {
            name: "aws",
            color: "bisque",
            ...defaultValues,
          },
          {
            name: "api",
            color: "lanchedalmond	",
            ...defaultValues,
          },
          {
            name: "azure",
            color: "blue",
            ...defaultValues,
          },
          {
            name: "powershell",
            color: "blueviolet",
            ...defaultValues,
          },
          {
            name: "firebase",
            color: "brown",
            ...defaultValues,
          },
          {
            name: "selenium",
            color: "burlywood	",
            ...defaultValues,
          },
          {
            name: "spring-boot",
            color: "cadetblue",
            ...defaultValues,
          },
          {
            name: "docker",
            color: "chartreuse",
            ...defaultValues,
          },
          {
            name: "react-native",
            color: "chocolate",
            ...defaultValues,
          },
          {
            name: "data-frame",
            color: "coral",
            ...defaultValues,
          },
          {
            name: "unity",
            color: "cornflowerblue",
            ...defaultValues,
          },
          {
            name: "unreal-engine",
            color: "cornsilk",
            ...defaultValues,
          },
          {
            name: "elasticsearch",
            color: "crimson",
            ...defaultValues,
          },
          {
            name: "matplotlib",
            color: "cyan",
            ...defaultValues,
          },
          {
            name: "go",
            color: "deeppink",
            ...defaultValues,
          },
          {
            name: "jenkins",
            color: "deepskyblue",
            ...defaultValues,
          },
          {
            name: "selenium",
            color: "dodgerblue",
            ...defaultValues,
          },
          {
            name: "gradle",
            color: "firebrick",
            ...defaultValues,
          },
          {
            name: "machine-learning",
            color: "floralwhite	",
            ...defaultValues,
          },
          {
            name: "amazon-s3",
            color: "forestgreen",
            ...defaultValues,
          },
          {
            name: "vue",
            color: "fuchsia",
            ...defaultValues,
          },
          {
            name: "ggplot2",
            color: "gainsboro",
            ...defaultValues,
          },
          {
            name: "flask",
            color: "gold",
            ...defaultValues,
          },
          {
            name: "asp.net-core",
            color: "goldenrod",
            ...defaultValues,
          },
          {
            name: "npm",
            color: "green",
            ...defaultValues,
          },
          {
            name: "webpack",
            color: "greenyellow",
            ...defaultValues,
          },
          {
            name: "mongoose",
            color: "honeydew",
            ...defaultValues,
          },
          {
            name: "tkinter",
            color: "hotpink",
            ...defaultValues,
          },
          {
            name: "web-scraping",
            color: "indianred",
            ...defaultValues,
          },
          {
            name: "spring-security",
            color: "",
            ...defaultValues,
          },
          {
            name: "filter",
            color: "indigo",
            ...defaultValues,
          },
          {
            name: "https",
            color: "ivory",
            ...defaultValues,
          },
          {
            name: "woo-commerce",
            color: "khaki",
            ...defaultValues,
          },
          {
            name: "stripe",
            color: "lavender",
            ...defaultValues,
          },
          {
            name: "web-socket",
            color: "lavenderblush	",
            ...defaultValues,
          },
          {
            name: "ios",
            color: "lawngreen",
            ...defaultValues,
          },
          {
            name: "android",
            color: "lemonchiffon",
            ...defaultValues,
          },
          {
            name: "kotlin",
            color: "lightblue",
            ...defaultValues,
          },
          {
            name: "redux",
            color: "lightcoral",
            ...defaultValues,
          },
          {
            name: "sass",
            color: "lightcyan",
            ...defaultValues,
          },
          {
            name: "css",
            color: "lightgoldenrodyellow",
            ...defaultValues,
          },
          {
            name: "html",
            color: "lightgreen",
            ...defaultValues,
          },
          {
            name: "hive",
            color: "lightpink",
            ...defaultValues,
          },
          {
            name: "java",
            color: "lightsalmon",
            ...defaultValues,
          },
          {
            name: "redis",
            color: "lightseagreen",
            ...defaultValues,
          },
          {
            name: "sql",
            color: "lightskyblue",
            ...defaultValues,
          },
          {
            name: "cmake",
            color: "lightslategray",
            ...defaultValues,
          },
        ],
        { transaction }
      );
    } else {
      console.log("Found existing data in topics table, so seeder script will not insert data.");
    }
    return await transaction.commit();
  },
  down: async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().bulkDelete("topics", null, { truncate: true });
  },
};
