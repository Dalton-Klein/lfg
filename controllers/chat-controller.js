const db = require('../models/index');
const { Op } = require('sequelize'); 
  
const getAllChatsForUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const foundChats = await db.PrivateChat.findAll({
      where: {
        users: { [Op.contains]: [userId] }
      },
    });
    console.log('Did we find the right chats? ',foundChats);
    res.status(200).send(foundChats);
  } catch (err){
    console.log('GET ERROR', err);
    res.status(500).send(`GET ERROR: ${err}`);
  }
}

const getSingleChatForUser = async (req, res) => {
  try {
    const { chatId } = req.body;
    const foundChat = await db.PrivateChat.findOne(
      {where: {id: chatId}}
    );
    console.log('Did we find the chat? ',foundChat);
    res.status(200).send(foundChat);
  } catch (err){
    console.log('GET ERROR', err);
    res.status(500).send(`GET ERROR: ${err}`);
  }
}

const getMessages = async (req, res) => {
  try {
    const { chatId } = req.body;
    let reply = 'NoMessages';
    reply = await db.Message.findAll({
      where: {
        PrivateChatId: chatId,
      },
    });
    res.status(200).send(reply);
  } catch (err) {
    console.log('GET ERROR', err);
    res.status(500).send(`GET ERROR: ${err}`);
  }
};
//Finds how many are messaging seller about an item
const getNumChatsByItem = async (req, res) => {
  try {
    const { itemId } = req.body;
    console.log('Made it here with id ', itemId);
    let numFound = 0;
    let reply;
    reply = await db.PrivateChat.findAll({
      where: {
        itemId: itemId,
      },
    });
    if (reply) numFound = reply.length
    res.status(200).send(`${numFound}`);
  } catch (err) {
    console.log('GET ERROR', err);
    res.status(500).send(`GET ERROR: ${err}`);
  }
};

// Used when user is on details page and presses message seller
// Since we do not know if chat already exists, we must decide and go to it if it does
// If it doesn't exist, chat gets created then go to it
const seeIfChatExists = async (req, res) => {
  try {
    const { itemId, buyer, seller } = req.body;
    let foundChats;
    foundChats = await db.PrivateChat.findAll({
      where: {
        itemId,
      },
    });
    let chatIdFound;
    foundChats.forEach((chat) => {
      if (
        chat.dataValues.users.includes(buyer) &&
        chat.dataValues.users.includes(seller)
      ) {
        chatIdFound = chat;
      }
    });
    if ( chatIdFound == undefined ) {
      chatIdFound = await db.PrivateChat.create({
        users: [buyer, seller],
        itemId,
      });
    }
    res.status(200).send(chatIdFound);
  } catch (err) {
    console.log('GET ERROR', err);
    res.status(500).send(`GET ERROR: ${err}`);
  }
};

const updateAgreedParties = async (req, res)=>{
  try {
    console.log('A User Is Editing A Chat!');
    const { id, token } = req.headers;
    let tokenValid;
    if (token) {
      tokenValid = await services.checkToken(id, token);
    }
    let reply = '';
    if (tokenValid === true || process.env.IS_PRODUCTION === 'false') {
      const {id, chatId } = req.body;
      const filter = { where: { id: chatId } };
      reply = await db.PrivateChat.findOne(filter);
      //Check if record exists in db
      if (reply) {
        if( reply.partiesAgreed.includes(id) ) {
          reply.update({
            partiesAgreed: reply.partiesAgreed.filter(function(item) {
              return item !== id
            })
          });
        } else {
          reply.update({
            partiesAgreed: [...reply.partiesAgreed, id]
          });
        }
      } else reply = { error: 'User not authorized to make this request.' };
    }
    res.status(200).send(reply);
  } catch (err) {
    console.log('POST ERROR', err);
    res.status(500).send('POST ERROR');
  }
}

module.exports = {
  getAllChatsForUser,
  getSingleChatForUser,
  getMessages,
  updateAgreedParties,
  getNumChatsByItem,
  seeIfChatExists
};
