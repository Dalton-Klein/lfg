const db = require('../models/index');

const sendMessage = async (req, res) => {
  try {
    console.log('POST');
    const { sender, content, PrivateChatId } = req.body;
    console.log(content, sender);
    const reply = await db.Message.create({
      sender,
      content: content,
      PrivateChatId,
    });
    res.status(200).send(reply);
  } catch (err) {
    console.log('POST ERROR', err);
    res.status(500).send('POST ERROR');
  }
};

module.exports = {
  sendMessage,
};
