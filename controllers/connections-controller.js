require("dotenv").config();
const Sequelize = require("sequelize");
const { sequelize } = require("../models/index");
const { getConnectionsForUserQuerySenders, getConnectionsForUserQueryAcceptors } = require("../services/connections-queries");

/*
get connections logic
*/
const getConnectionsForUser = async (req, res) => {
  try {
    console.log(" ♛ A User Requested Their Connections ♛ ");
    const { userId, token } = req.body;
    let query;
    query = getConnectionsForUserQuerySenders();
    const senderConnections = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId,
      },
    });
    query = getConnectionsForUserQueryAcceptors();
    const acceptorConnections = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId,
      },
    });
    const connections = acceptorConnections.concat(senderConnections);
    res.status(200).send(connections);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const createConnection = async (req, res) => {
  try {
    const { owner, content, category, topics } = req.body.post;
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
      insert into posts (owner, content, categories, ${topicsColumnQueryString} number_votes, created_at, updated_at)
      values (:owner, :content, :categories, ${topicsValueQueryString} :number_votes, now(), now())
      `,
      {
        type: Sequelize.QueryTypes.INSERT,
        replacements: {
          owner,
          content,
          categories: category,
          number_votes: 0,
          created_at: `${Date.now()}`,
          updated_at: `${Date.now()}`,
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
  getConnectionsForUser,
  createConnection,
};
