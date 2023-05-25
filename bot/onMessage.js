const getNextAction = require('../ai/actions/chat');
const createSearchQuery = require('../ai/actions/searchQuery');
const messages = require('../language/messages.json');
const bot = require('./bot');
const aboutMe = require('./commands/aboutme');
const sendMarkdownMessage = require('./sendMarkdown');
const { getOffersByQuery, getLastOffersByUser } = require('../infojobs/offers');
const { printJobs } = require('./commands/jobs');
const User = require('../db/models/user');
const getHelp = require('../ai/actions/help');
const getJoke = require('../ai/actions/joke');
const { getProfile, deleteProfile } = require('./commands/profile');

module.exports = () => {
	bot.on('message', async (msg) => {
		if (msg.text === '/start') return;

		const chatId = msg.chat.id;
		const user = await User.findOne({ chatId });
		if (!user) {
			await sendMarkdownMessage(chatId, messages.profileNotFound);
			return;
		}

		if (user.executing) {
			await sendMarkdownMessage(chatId, messages.executing);
			return;
		}

		await User.findOneAndUpdate({ chatId }, { executing: true });

		const nextAction = await getNextAction(chatId, msg.text);

		console.log(user.chatId, nextAction.action, msg.text);

		switch (nextAction.action) {
			case 'aboutMe':
				await aboutMe(chatId, msg.text);
				break;
			case 'aboutMeModify':
				await aboutMe(chatId, msg.text, true);
				break;
			case 'profile':
				await getProfile(chatId);
				break;
			case 'jobs':
				var query = await createSearchQuery(chatId, msg.text);
				if (query) {
					var offersByQuery = await getOffersByQuery(query);
					await printJobs(chatId, offersByQuery, false);
				} else {
					await sendMarkdownMessage(chatId, messages.searchQueryError);
				}
				break;
			case 'jobsProfile':
				var offersByUser = await getLastOffersByUser(user);
				await printJobs(chatId, offersByUser);
				break;
			case 'help':
				var response = await getHelp(chatId, msg.text);
				await sendMarkdownMessage(chatId, response);
				await sendMarkdownMessage(chatId, messages.helpSimple);
				break;
			case 'joke':
				var joke = await getJoke(chatId);
				await sendMarkdownMessage(chatId, joke);
				break;
			case 'delete':
				await deleteProfile(chatId);
				break;
			default:
				await sendMarkdownMessage(chatId, nextAction.message ?? messages.aiError);
				break;
		}

		await User.findOneAndUpdate({ chatId }, { executing: false });

		return;
	});
};
