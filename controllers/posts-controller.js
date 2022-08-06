require("dotenv").config();
const db = require("../models/index");
const Sequelize = require("sequelize");
const { sequelize } = require("../models/index");

/*
Get Posts Logic
*/
const getPosts = async (req, res) => {
  try {
    console.log(" ♛ A User Requested Posts ♛ ");
    const { userId, token } = req.body;
    // const filter = { where: { email: email } };
    let posts = await sequelize.query(
      `
          select p.id, 
                 p.content, 
                 p.owner, 
                 u.username, 
                 u.avatar_url as "avatarUrl", 
                 p.number_votes, 
                 p.created_at as created_at, 
                 p.updated_at as updated_at, 
                 p.photo_url,
                 c.name as category, 
                 c.color as category_color,
                 c.color,
                 (SELECT array(
                        SELECT t.name
                          FROM topics t
                         WHERE t.id = any(p.topics) )) AS topic_names,
                 (SELECT array(
                        SELECT t.color
                          FROM topics t
                         WHERE t.id = any(p.topics) )) AS topic_colors
            from posts p
            join users u
              on u.id = p.owner
            join categories c
              on c.id = p.categories
        order by p.created_at desc
			`,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          username: req.body.username,
        },
      }
    );
    res.status(200).send(posts);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const createPost = async (req, res) => {
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

const getCategoriesAndTopics = async (req, res) => {
  try {
    const categories = await db.categories.findAll();
    const topics = await db.topics.findAll();
    const result = {
      categories,
      topics,
    };
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send("POST ERROR");
  }
};

module.exports = {
  getPosts,
  createPost,
  getCategoriesAndTopics,
};
