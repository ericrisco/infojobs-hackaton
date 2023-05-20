const util = require('util');
const User = require('../../db/models/user');
const messages = require('../../language/messages.json');

const getAboutMeSummarized = require('../../ai/actions/summarizer');
const sendMarkdownMessage = require('../sendMarkdown');

const bot = require('../bot');
const errorHandling = require('../errorHandling');
const generateAiMessage = require('../../ai/actions/messageGenerator');

module.exports = () => {
	bot.onText(/\/start/, async (msg) => {
		const chatId = msg.chat.id;
		const { first_name, last_name } = msg.from;

		try {
			let user = await User.findOne({ chatId });
			if (user) {
				const welcomeBackMessage = user.firstName === '' ? messages.welcomeBackNoName : util.format(messages.welcomeBack, user.firstName);
				const message = await generateAiMessage(welcomeBackMessage);
				await sendMarkdownMessage(bot, chatId, message);
			} else {
				let newUser = new User({
					chatId,
					firstName: first_name,
					lastName: last_name
				});
				await newUser.save();

				const welcomeNewMessage = await generateAiMessage(messages.welcomeNew);
				await sendMarkdownMessage(bot, chatId, welcomeNewMessage);
				await sendMarkdownMessage(bot, chatId, messages.exampleProfile);
				await sendMarkdownMessage(bot, chatId, messages.goDescription);

				bot.on('message', async (msg) => {
					if (msg.text) {
						try {
							await User.findOneAndUpdate({ chatId }, { aboutMe: msg.text });

							const summary = await getAboutMeSummarized(chatId, msg.text);
							let summaryMessage = util.format(
								messages.userProfileSummary,
								summary.age || 'N/A',
								summary.city || 'N/A',
								summary.category || 'N/A',
								summary.position || 'N/A',
								summary.experienceYears || 'N/A',
								summary.remote ? 'Sí' : 'No',
								summary.others || 'N/A',
								summary.other_city ? 'Sí' : 'No',
								summary.others_city ? summary.others_city.join(', ') : 'N/A',
								summary.recomendation
							);

							await sendMarkdownMessage(bot, chatId, summaryMessage);

							const profileStatusmessage = await generateAiMessage(
								summary.score >= 6 ? messages.completeProfileMessage : messages.incompleteProfileMessage
							);
							await sendMarkdownMessage(bot, chatId, profileStatusmessage);
						} catch (err) {
							errorHandling(bot, chatId, err);
						}
					}
				});
			}
		} catch (err) {
			errorHandling(bot, chatId, err);
		}
	});
};
