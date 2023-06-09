const sendMarkdownMessage = require('../sendMarkdown');
const messages = require('../../language/messages.json');
const util = require('util');
const errorHandling = require('../errorHandling');
const User = require('../../db/models/user');
const { getLoginUrl } = require('../../infojobs/login');
const { getToken } = require('../../infojobs/token');
const { getPrincipalCurriculumId, getSkills } = require('../../infojobs/curriculum');
const { getInfojobsProfile } = require('../../infojobs/profile');

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
					user.keywords || 'N/A',
					user.willingToRelocate ? 'Sí' : 'No',
					user.relocationCities ? user.relocationCities.join(', ') : 'N/A',
					user.recomendation
				);

				await sendMarkdownMessage(chatId, summaryMessage);
			}

			const score = user.score;
			const availableForJobSearch = score >= 7;

			const profileStatusmessage = availableForJobSearch ? messages.completeProfileMessage : messages.incompleteProfileMessage;

			await sendMarkdownMessage(chatId, profileStatusmessage);
			if (!availableForJobSearch){
				await sendMarkdownMessage(chatId, messages.exampleModify);
			} 
		}
	} catch (err) {
		errorHandling(chatId, err);
	}
}

async function remoteProfile(chatId, code) {
	try {		
		if(!code){
			const loginUrl = await getLoginUrl(chatId);	
			var remoteProfileMessage = util.format(messages.remoteProfile, loginUrl);
			await sendMarkdownMessage(chatId, remoteProfileMessage);
		}else{
			await sendMarkdownMessage(chatId, messages.thanksAccessMessage);
			
			const token = await getToken(chatId, code);
			const profile = await getInfojobsProfile(token);
			const cvId = await getPrincipalCurriculumId(token);
			const skills = await getSkills(token, cvId);

			const final = {
				profile,
				skills
			}
			return final
		}
	} catch (err) {
		errorHandling(chatId, err);
	}

}

async function deleteProfile(chatId) {
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
	deleteProfile,
	remoteProfile
};
