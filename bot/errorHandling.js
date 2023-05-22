const messages = require('../language/messages.json');
const sendMarkdownMessage = require('./sendMarkdown');

async function errorHandling(bot, chatId, error) {
	console.error(error);
	await sendMarkdownMessage(bot, chatId, messages.errorMessage);
}

module.exports = errorHandling;
