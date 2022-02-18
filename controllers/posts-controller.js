const db = require("../models/index");

const createPost = async (req, res) => {
  try {
    const { sender } = req.body;
    // const reply = await db.Message.create({
    //   sender,
    //   content: content,
    //   PrivateChatId,
    // });
    // res.status(200).send(reply);
  } catch (err) {
    console.log(err);
    res.status(500).send("POST ERROR");
  }
};

const getCategoriesAndTopics = async (req, res) => {
  try {
    const categories = await db.categories.findAll();
    const topics = await db.topics.findAll();
    console.log("categories: ", categories);
    console.log("topics: ", topics);
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
  createPost,
  getCategoriesAndTopics,
};
