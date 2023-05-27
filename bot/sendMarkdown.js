const bot = require('./bot');

async function sendMarkdownMessage(chatId, message) {
	try {		
		await new Promise((resolve) => setTimeout(resolve, 2000));
		await bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
	} catch (err) {
		console.error('Error sending message: ', err);
	}
}

module.exports = sendMarkdownMessage;
