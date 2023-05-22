const util = require('util');
const User = require('../../db/models/user');
const messages = require('../../language/messages.json');
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

				if (!user.availableForJobSearch) {
					await sendMarkdownMessage(bot, chatId, messages.giveMeInfo);
					await sendMarkdownMessage(bot, chatId, messages.goDescription);
				}
			} else {
				let newUser = new User({
					chatId,
					firstName: first_name,
					lastName: last_name
				});
				await newUser.save();

				await sendMarkdownMessage(bot, chatId, messages.welcomeNew);
			}
		} catch (err) {
			errorHandling(bot, chatId, err);
		}
	});
};
