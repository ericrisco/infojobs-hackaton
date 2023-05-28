const util = require('util');
const User = require('../../db/models/user');
const messages = require('../../language/messages.json');

const sendMarkdownMessage = require('../sendMarkdown');

const errorHandling = require('../errorHandling');
const { getLastOffersByUser, getOfferById } = require('../../infojobs/offers');
const getOpinion = require('../../ai/actions/opinion');

async function printJobs(chatId, offers, cron = false) {
	try {
		const currentResults = offers.currentResults;
		const totalResults = offers.totalResults;

		if (totalResults == 0) {
			await sendMarkdownMessage(chatId, messages.noJobsFound);
		} else {
			const user = await User.findOne({ chatId });
			if (!cron) {
				await sendMarkdownMessage(chatId, util.format(messages.jobsFound, totalResults, currentResults));
				await sendMarkdownMessage(chatId, messages.analaizingJobs);
			}

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

				await sendMarkdownMessage(chatId, formattedJobOfferSummary);
			}
		}
	} catch (err) {
		errorHandling(chatId, err);
	}
}

async function getJobsFromProfile(chatId) {
	try {
		const user = await User.findOne({ chatId });

		if (user.availableForJobSearch) {
			const offers = await getLastOffersByUser(user);

			const currentResults = offers.currentResults;
			const totalResults = offers.totalResults;

			const message = totalResults == 0 ? messages.noJobsFound : util.format(messages.jobsFound, totalResults, currentResults);
			await sendMarkdownMessage(chatId, message);
			await sendMarkdownMessage(chatId, messages.analaizingJobs);

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

				await sendMarkdownMessage(chatId, formattedJobOfferSummary);
			}

			await sendMarkdownMessage(chatId, messages.helpSimple);
		} else {
			await sendMarkdownMessage(chatId, messages.incompleteProfileMessage);
		}
	} catch (err) {
		errorHandling(chatId, err);
	}
}

module.exports = {
	printJobs,
	getJobsFromProfile
};
