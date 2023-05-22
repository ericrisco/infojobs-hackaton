const messages = require('../language/messages.json');
const sendMarkdownMessage = require('./sendMarkdown');

async function errorHandling(chatId, error) {
	console.error(error);
	await sendMarkdownMessage(chatId, messages.errorMessage);
}

module.exports = errorHandling;
