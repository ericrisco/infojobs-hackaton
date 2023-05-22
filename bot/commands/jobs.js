const util = require('util');
const User = require('../../db/models/user');
const messages = require('../../language/messages.json');

const sendMarkdownMessage = require('../sendMarkdown');

const errorHandling = require('../errorHandling');
const { getLastOffersByUser, getOfferById } = require('../../infojobs/offers');
const getOpinion = require('../../ai/actions/opinion');

async function getJobsFromProfile(bot, chatId) {
	try {
		const user = await User.findOne({ chatId });

		if (user.availableForJobSearch) {
			const offers = await getLastOffersByUser(user);

			const currentResults = offers.currentResults;
			const totalResults = offers.totalResults;

			const message = totalResults == 0 ? messages.noJobsFound : util.format(messages.jobsFound, totalResults, currentResults);
			await sendMarkdownMessage(bot, chatId, message);
			await sendMarkdownMessage(bot, chatId, messages.analaizingJobs);

			for (let i = 0; i < offers.items.length; i++) {
				const offer = offers.items[i];
				const title = offer['title'] || 'N/A';
				const city = offer['city'] || 'N/A';
				const link = offer['link'] || 'N/A';
				const category = offer['category']?.value || 'N/A';
				const contractType = offer['contractType']?.value || 'N/A';
				const salary = offer['salaryDescription'] || 'N/A';
				const experienceMin = offer['experienceMin']?.value || 'N/A';
				const workDay = offer['workDay']?.value || 'N/A';
				const study = offer['study']?.value || 'N/A';
				const teleworking = offer['teleworking']?.value || 'N/A';

				const offerDetail = await getOfferById(offer['id']);
				const description = offerDetail.description;

				const opinion = await getOpinion(user, { title, description, city, salary, study, teleworking });

				const formattedJobOfferSummary = util.format(
					messages.jobOfferSummary,
					title,
					city,
					link,
					category,
					contractType,
					salary,
					experienceMin,
					workDay,
					study,
					teleworking,
					opinion
				);

				await sendMarkdownMessage(bot, chatId, formattedJobOfferSummary);
			}

			await sendMarkdownMessage(bot, chatId, messages.remember);
		} else {
			await sendMarkdownMessage(bot, chatId, messages.incompleteProfileMessage);
		}
	} catch (err) {
		errorHandling(bot, chatId, err);
	}
}

module.exports = getJobsFromProfile;
