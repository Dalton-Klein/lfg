require('dotenv').config();
const db = require('../models/index');
const Sequelize = require('sequelize');

/*
Get Posts Logic
*/
const getPosts = async (req, res) => {
	try {
		console.log(' ♛ A User Requested Posts ♛ ');
		const { userId, token } = req.body;
		// const filter = { where: { email: email } };
		let posts = await db.posts.findAll();
		console.log('here are the posts: ', posts);
		// let user = await UserTable.findOne(filter);
		// let result = '';
		// if (user !== null) {
		// 	//If matching user is found, compare passwords
		// 	const validPass = await bcrypt.compare(password, user.hashed);
		// 	if (validPass) {
		// 		const token = services.keyGen(15);
		// 		await TokenTable.destroy({ where: { id: user.id } }); //delete Old tokens
		// 		user = user.dataValues;
		// 		const newToken = await TokenTable.create({ id: user.id, token });
		// 		delete user.hashed;
		// 		result = { token: newToken.token, data: user };
		// 	} else result = { error: 'one of your credentials is incorrect' };
		// } else result = { error: 'one of your credentials is incorrect' };
		res.status(200).send(posts);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
};

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
		res.status(500).send('POST ERROR');
	}
};

const getCategoriesAndTopics = async (req, res) => {
	try {
		const categories = await db.categories.findAll();
		const topics = await db.topics.findAll();
		console.log('categories: ', categories);
		console.log('topics: ', topics);
		const result = {
			categories,
			topics,
		};
		res.status(200).send(result);
	} catch (err) {
		console.log(err);
		res.status(500).send('POST ERROR');
	}
};

module.exports = {
	getPosts,
	createPost,
	getCategoriesAndTopics,
};
