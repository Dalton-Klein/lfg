require("dotenv").config();
const db = require("../models/index");
const Sequelize = require("sequelize");
const { sequelize } = require("../models/index");
const { getRustTilesQuery } = require("../services/tiles-queries");

/*
Get Posts Logic
*/
const getRustTiles = async (req, res) => {
  try {
    console.log(" ♛ A User Requested Rust Tiles ♛ ");
    const { userId, token } = req.body;
    // const filter = { where: { email: email } };
    const query = getRustTilesQuery();
    let posts = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        username: req.body.username,
      },
    });
    res.status(200).send(posts);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const createRustTile = async (req, res) => {
  try {
    const { owner, content, category, topics } = req.body.post;
    console.log("create post req body: ", req.body);
    let topicsColumnQueryString = "";
    let topicsValueQueryString = "";
    if (topics.length) {
      topicsValueQueryString += `array [`;
      topicsColumnQueryString = "topics, ";
      req.body.post.topics.forEach((topicId) => {
        topicsValueQueryString += `${topicId}, `;
      });
      topicsValueQueryString = topicsValueQueryString.substring(0, topicsValueQueryString.length - 2);
      topicsValueQueryString += "], ";
    }
    const reply = await await sequelize.query(
      `
      insert into posts (owner, content, categories, ${topicsColumnQueryString} number_votes, "createdAt", "updatedAt")
      values (:owner, :content, :categories, ${topicsValueQueryString} :number_votes, now(), now())
      `,
      {
        type: Sequelize.QueryTypes.INSERT,
        replacements: {
          owner,
          content,
          categories: category,
          number_votes: 0,
          createdAt: `${Date.now()}`,
          updatedAt: `${Date.now()}`,
        },
      }
    );
    res.status(200).send(reply);
  } catch (err) {
    console.log(err);
    res.status(500).send("POST ERROR");
  }
};

module.exports = {
  getRustTiles,
  createRustTile,
};
