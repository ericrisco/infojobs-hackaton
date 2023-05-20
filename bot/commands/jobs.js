//const util = require('util');
const User = require('../../db/models/user');
//const messages = require('../../language/messages.json');

//const sendMarkdownMessage = require('../sendMarkdown');

const bot = require('../bot');
const errorHandling = require('../errorHandling');
const getOffersByUser = require('../../infojobs/offers');

module.exports = () => {
	bot.onText(/\/jobs/, async (msg) => {
		const chatId = msg.chat.id;

		try {
			const user = await User.findOne({ chatId });
			const offers = await getOffersByUser(user);
			console.log(offers);
		} catch (err) {
			errorHandling(bot, chatId, err);
		}
	});
};
