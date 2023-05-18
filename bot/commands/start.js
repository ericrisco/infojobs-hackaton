const util = require('util');
const User = require('../../db/models/user');
const messages = require('../../language/messages.json');

const getAboutMeSummarized = require('../../ai/actions/summarizer');
const sendMarkdownMessage = require('../sendMarkdown');

const bot = require('../bot');
const errorHandling = require('../errorHandling');

module.exports = () => {
	bot.onText(/\/start/, async (msg) => {
		const chatId = msg.chat.id;
		const { first_name, last_name } = msg.from;

		try {
			let user = await User.findOne({ chatId });
			if (user) {
				const welcomeBackMessage = user.firstName === '' ? messages.welcomeBackNoName : util.format(messages.welcomeBack, user.firstName);
                await sendMarkdownMessage(bot, chatId, welcomeBackMessage);
			} else {
				let newUser = new User({ chatId, firstName: first_name, lastName: last_name });
				await newUser.save();

                await sendMarkdownMessage(bot, chatId, messages.welcomeNew);
                await sendMarkdownMessage(bot, chatId, messages.giveMeInfo);
                await sendMarkdownMessage(bot, chatId, messages.exampleProfile);

				bot.on('message', async (msg) => {
					if (msg.text) {
						try {
							await User.findOneAndUpdate({ chatId }, { aboutMe: msg.text });

							const summary = await getAboutMeSummarized(chatId, msg.text);
                            let summaryMessage = util.format(
                                messages.userProfileSummary,
                                summary.age,
                                summary.city,
                                summary.category || "N/A",
                                summary.position || "N/A",
                                summary.experienceYears,
                                summary.remote ? "Sí" : "No",
                                summary.others || "N/A",
                                summary.other_city ? "Sí" : "No",
                                summary.others_city.join(', '),
                                summary.recomendation
                            );
                            
                            await sendMarkdownMessage(bot, chatId, summaryMessage);
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
