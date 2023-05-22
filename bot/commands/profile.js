const sendMarkdownMessage = require('../sendMarkdown');
const messages = require('../../language/messages.json');
const util = require('util');
const errorHandling = require('../errorHandling');
const User = require('../../db/models/user');

async function getProfile(chatId) {
	try {
		const user = await User.findOne({ chatId });

		if (!user) {
			await sendMarkdownMessage(chatId, messages.profileNotFound);
			await sendMarkdownMessage(chatId, messages.incompleteProfileMessage);
			await sendMarkdownMessage(chatId, messages.exampleProfile);
		} else {
			if (user.recomendation) {
				const summaryMessage = util.format(
					messages.userProfileSummary,
					user.age || 'N/A',
					user.city || 'N/A',
					user.position || 'N/A',
					user.experienceYears || 'N/A',
					user.remote ? 'Sí' : 'No',
					user.others || 'N/A',
					user.other_city ? 'Sí' : 'No',
					user.others_city ? user.others_city.join(', ') : 'N/A',
					user.recomendation
				);

				await sendMarkdownMessage(chatId, summaryMessage);
			}

			const score = user.score;
			const availableForJobSearch = score >= 7;

			const profileStatusmessage = availableForJobSearch ? messages.completeProfileMessage : messages.incompleteProfileMessage;

			await sendMarkdownMessage(chatId, profileStatusmessage);
			if (!availableForJobSearch) await sendMarkdownMessage(chatId, messages.exampleProfile);
		}
	} catch (err) {
		errorHandling(chatId, err);
	}
}

async function deleteProfile(chatId){
	try {
		const user = await User.findOne({ chatId });

		if (!user) {
			await sendMarkdownMessage(chatId, messages.profileNotFound);
		} else {
            await User.deleteOne({ chatId });
			await sendMarkdownMessage(chatId, messages.profileDeleted);
		}
        
	} catch (err) {
		errorHandling(chatId, err);
	}
}

module.exports = { 
    getProfile,
    deleteProfile
}
