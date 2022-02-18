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

module.exports = {
	getPosts,
};
