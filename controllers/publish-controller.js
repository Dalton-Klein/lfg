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
		queryResult = queryResult[0];
		if (queryResult.about === null || queryResult.about === '') problemFields.push('about');
		if (queryResult.age === null || queryResult.age < 13) problemFields.push('age');
		if (queryResult.gender === null || queryResult.gender === 0) problemFields.push('gender');
		if (queryResult.region === null || queryResult.region === 0) problemFields.push('region');
		if (queryResult.languages === null) problemFields.push('language');
		if (queryResult.preferred_platform === null) problemFields.push('platform');
		if (queryResult.hours === null) problemFields.push('hours');
		if (queryResult.weekdays === null || queryResult.weekdays === 0) problemFields.push('weekday availability');
		if (queryResult.weekdends === null || queryResult.weekdends === 0) problemFields.push('weekend availability');
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
