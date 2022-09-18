require('dotenv').config();
const Sequelize = require('sequelize');
const { sequelize } = require('../models/index');
const { checkIfUserCanPublishRustProfileQuery } = require('../services/publish-queries');

/*
get existing connections logic
*/
const checkIfUserCanPublishRustProfile = async (req, res) => {
	try {
		console.log(' ♛ A User Requested To Publish Rust Profile ♛ ');
		const { userId, token } = req.body;
		let query = checkIfUserCanPublishRustProfileQuery();
		let queryResult = await sequelize.query(query, {
			type: Sequelize.QueryTypes.SELECT,
			replacements: {
				userId,
			},
		});
		let passesValidation = false;
		let problemFields = [];
		//Validate result here
		console.log('what is res? ', queryResult);
		queryResult = queryResult[0];
		if (queryResult.about === null) problemFields.push('about');
		if (queryResult.age === null) problemFields.push('age');
		if (queryResult.gender === null) problemFields.push('gender');
		if (queryResult.region === null) problemFields.push('region');
		if (queryResult.languages === null) problemFields.push('language');
		if (queryResult.preferred_platform === null) problemFields.push('preferred_platform');
		if (queryResult.weekdays === null) problemFields.push('weekdaysAvailability');
		if (queryResult.weekdends === null) problemFields.push('weekendsAvailability');
		if (queryResult.hours === null) problemFields.push('hours');
		if (!problemFields.length) passesValidation = true;
		let result = {
			status: passesValidation ? 'success' : 'error',
			data: problemFields,
		};
		res.status(200).send(result);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
};

module.exports = {
	checkIfUserCanPublishRustProfile,
};
