const User = require('../../db/models/user');
const sendMarkdownMessage = require('../sendMarkdown');
const messages = require('../../language/messages.json');
const util = require('util');
const errorHandling = require('../errorHandling');
const getAboutMeSummarized = require('../../ai/actions/summarizer');

async function aboutMe(chatId, text, modify = false) {
	if (text) {
		try {
			const user = await User.findOne({ chatId });
			const message = modify ? `${user.aboutMe} ${text}` : text;
			await User.updateOne({ chatId }, { aboutMe: message });
			
			await sendMarkdownMessage(chatId, messages.giveMeTime);

			const summary = await getAboutMeSummarized(chatId, message);

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
					summary.willingToRelocate ? 'Sí' : 'No',
					summary.relocationCities ? summary.relocationCities.join(', ') : 'N/A',
					summary.recomendation || 'N/A'
				);

				await sendMarkdownMessage(chatId, summaryMessage);

				const score = summary.score;
				const availableForJobSearch = score >= 6;

				if (!availableForJobSearch) {
					await sendMarkdownMessage(chatId, messages.incompleteProfileMessage);
				}
				await sendMarkdownMessage(chatId, messages.exampleModify);

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
