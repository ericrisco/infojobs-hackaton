const sendMarkdownMessage = require('../sendMarkdown');
const messages = require('../../language/messages.json');
const util = require('util');
const errorHandling = require('../errorHandling');
const User = require('../../db/models/user');
const getAboutMeSummarized = require('../../ai/actions/summarizer');

async function aboutMe(chatId, text) {
	if (text) {
		try {
			await User.findOneAndUpdate({ chatId }, { aboutMe: text });

			const summary = await getAboutMeSummarized(chatId, text);

			if (summary.error) {
				await sendMarkdownMessage(chatId, summary.message);
			} else {
				const summaryMessage = util.format(
					messages.userProfileSummary,
					summary.age || 'N/A',
					summary.city || 'N/A',
					summary.position || 'N/A',
					summary.experienceYears || 'N/A',
					summary.remote ? 'Sí' : 'No',
					summary.keywords || 'N/A',
					summary.other_city ? 'Sí' : 'No',
					summary.others_city ? summary.others_city.join(', ') : 'N/A',
					summary.recomendation
				);

				await sendMarkdownMessage(chatId, summaryMessage);

				const score = summary.score;
				const availableForJobSearch = score >= 7;

				const profileStatusmessage = availableForJobSearch ? messages.completeProfileMessage : messages.incompleteProfileMessage;

				await sendMarkdownMessage(chatId, profileStatusmessage);
				if (!availableForJobSearch) await sendMarkdownMessage(chatId, messages.exampleProfile);

				summary.score = score;
				summary.availableForJobSearch = availableForJobSearch;

				await User.findOneAndUpdate({ chatId }, { ...summary });
			}
		} catch (err) {
			errorHandling(chatId, err);
		}
	}
}

module.exports = aboutMe;
