const getNextAction = require('../ai/actions/chat');
const bot = require('./bot');
const aboutMe = require('./commands/aboutme');

module.exports = () => {
	bot.on('message', async (msg) => {
		const chatId = msg.chat.id;

		const nextAction = await getNextAction(msg.text);

		switch (nextAction) {
			case 'aboutMe':
				await aboutMe(chatId, msg.text);
				break;
			default:
				break;
		}

		return;
	});
};
