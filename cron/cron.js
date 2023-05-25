const User = require('../db/models/user');
const sendMarkdownMessage = require('../bot/sendMarkdown');
const messages = require('../language/messages.json');
const { getLastOffersByUser } = require('../infojobs/offers');
const { printJobs } = require('../bot/commands/jobs');

const dailyOffer = async () => {
	const users = await User.find({ availableForJobSearch: true, canSendDailyJobOffers: true });

	if (!users || users.length === 0) return;

	console.log(`Sending daily offer to ${users.length} users`);

	for (let i = 0; i < users.length; i++) {
		const user = users[i];
		var offers = await getLastOffersByUser(user, 20);
		console.log(`Sending daily offer to ${user.chatId}`);
		console.log(`Found ${offers.totalResults} offers`);

		if (!offers || offers.length === 0) {
			sendMarkdownMessage(user.chatId, messages.noDailyOffer);
			return;
		}

		const offersIds = offers.items.map((offer) => offer.id);
		const userSentJobOffersIds = user.sentJobOffersIds;
		let notSentId = offersIds.find((offerId) => !userSentJobOffersIds.includes(offerId));

		if (notSentId) {
			console.log(`Sending daily offer ${notSentId} to ${user.chatId}`);
			const notSentOffer = offers.items.find((offer) => offer.id === notSentId);
			offers.items = [notSentOffer];
			await printJobs(user.chatId, offers, true);

			await new Promise((resolve) => setTimeout(resolve, 60000));

			await sendMarkdownMessage(user.chatId, messages.dailyOffer);

			user.sentJobOffersIds.push(notSentId);
			await user.save();
		} else {
			console.log(`No daily offer to ${user.chatId}`);
			sendMarkdownMessage(user.chatId, messages.noDailyOffer);
		}
	}
};

module.exports = dailyOffer;
