const INFOJOBS_API_KEY = process.env.INFOJOBS_API_KEY;
const OFFER_LIST_URL = 'https://api.infojobs.net/api/9/offer?';
const OFFER_ID_URL = 'https://api.infojobs.net/api/7/offer/';

async function getLastOffersByUser(user) {
	let url = OFFER_LIST_URL;
	url += 'order=relevancia-desc';
	url += '&maxResults=3';
	url += '&sinceDate=_7_DAYS';
	url += user.category !== '' && user.category ? '&category=' + encodeURIComponent(user.category) : '';
	url += '&country=espana';
	url += user.keywords !== '' && user.keywords ? '&q=descripcion:' + encodeURIComponent(formatKeywords(user.keywords)) : '';
	url += user.city !== '' && user.city ? '&city=' + encodeURIComponent(user.city) : '';

	if (user.other_city) {
		user.others_city.forEach((city) => {
			url += '&city=' + encodeURIComponent(city);
		});
	}

	const res = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Basic ${INFOJOBS_API_KEY}`
		}
	});

	return await res.json();
}

async function getOffersByQuery(query) {
	let url = OFFER_LIST_URL;
	url += 'order=updated-desc';
	url += '&maxResults=3';
	url += '&sinceDate=_7_DAYS';
	url += query.category !== '' ? '&category=' + encodeURIComponent(query.category) : '';
	url += '&country=espana';
	url += query.keywords !== '' ? '&q=descripcion:' + encodeURIComponent(formatKeywords(query.keywords)) : '';

	query.cities.forEach((city) => {
		url += '&city=' + encodeURIComponent(city);
	});

	const res = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Basic ${INFOJOBS_API_KEY}`
		}
	});

	return await res.json();
}

async function getOfferById(offerId) {
	let url = OFFER_ID_URL + offerId;

	const res = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Basic ${INFOJOBS_API_KEY}`
		}
	});

	return await res.json();
}

function formatKeywords(text) {
	const keywords = text.split(',').map((keyword) => keyword.trim());

	const filteredKeywords = keywords.filter((keyword) => keyword.length > 4);

	const formattedString = filteredKeywords.join('*');

	return `*${formattedString}*`;
}

module.exports = {
	getLastOffersByUser,
	getOffersByQuery,
	getOfferById
};
