const sendMarkdownMessage = require('../sendMarkdown');
const messages = require('../../language/messages.json');

async function help(bot, chatId) {
	await sendMarkdownMessage(bot, chatId, messages.commands);
}

module.exports = help;
