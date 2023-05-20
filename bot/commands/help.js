const bot = require('../bot');
const sendMarkdownMessage = require('../sendMarkdown');
const messages = require('../../language/messages.json');

module.exports = () => {
	bot.onText(/\/help/, async (msg) => {
		const chatId = msg.chat.id;
		await sendMarkdownMessage(bot, chatId, messages.commands);
	});
};
