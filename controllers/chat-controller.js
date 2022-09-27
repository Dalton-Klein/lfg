const db = require('../models/index');
const { Op } = require('sequelize');

const getAllChatsForUser = async (req, res) => {
	try {
		const { userId } = req.body;
		const foundChats = await db.PrivateChat.findAll({
			where: {
				users: { [Op.contains]: [userId] },
			},
		});
		res.status(200).send(foundChats);
	} catch (err) {
		console.log('GET ERROR', err);
		res.status(500).send(`GET ERROR: ${err}`);
	}
};

const getSingleChatForUser = async (req, res) => {
	try {
		const { chatId } = req.body;
		const foundChat = await db.PrivateChat.findOne({ where: { id: chatId } });
		res.status(200).send(foundChat);
	} catch (err) {
		console.log('GET ERROR', err);
		res.status(500).send(`GET ERROR: ${err}`);
	}
};

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
		if (reply) numFound = reply.length;
		res.status(200).send(`${numFound}`);
	} catch (err) {
		console.log('GET ERROR', err);
		res.status(500).send(`GET ERROR: ${err}`);
	}
};

module.exports = {
	getAllChatsForUser,
	getSingleChatForUser,
	getMessages,
	getNumChatsByItem,
};
