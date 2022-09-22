const db = require('../models/index');
const { sequelize } = require('../models/index');
const Sequelize = require('sequelize');

const saveMessage = async (connectionId, senderId, content, timestamp) => {
	try {
		query = `
              insert into public.messages ( connection_id,
                                            sender,
                                            content,
                                            created_at,
                                            updated_at) 
                  values (:connection_id, 
                          :senderId, 
                          :content, 
                          :created_at, 
                          :updated_at)
            `;
		const result = await sequelize.query(query, {
			type: Sequelize.QueryTypes.INSERT,
			replacements: {
				connection_id: connectionId,
				senderId,
				content,
				created_at: timestamp,
				updated_at: timestamp,
			},
		});
		console.log('stored? ', result);
		return;
	} catch (err) {
		console.log(err);
	}
};

const getChatHistoryForUser = async (req, res) => {
	console.log(' ♛ A User Requested Chat History ♛ ');
	try {
		const { chatId } = req.body;
		query = `
              select m.*, u.username 
                from public.messages m
                join public.users u
                  on u.id = m.sender
               where m.connection_id = :chatId
            `;
		const foundChat = await sequelize.query(query, {
			type: Sequelize.QueryTypes.SELECT,
			replacements: {
				chatId,
			},
		});
		foundChat.forEach((chat) => {
			chat.message = chat.content;
			chat.sender = chat.username;
			delete chat.content;
		});
		res.status(200).send(foundChat);
	} catch (err) {
		console.log('GET ERROR', err);
		res.status(500).send(`GET ERROR: ${err}`);
	}
};

module.exports = {
	saveMessage,
	getChatHistoryForUser,
};
