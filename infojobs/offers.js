const INFOJOBS_API_KEY = process.env.INFOJOBS_API_KEY;

async function getLastOffersByUser(user) {
	let url = 'https://api.infojobs.net/api/9/offer?';
	url += 'order=relevancia-desc';
	url += '&maxResults=3';
	url += '&sinceDate=_7_DAYS';
	url += '&category=' + encodeURIComponent(user.category);
	url += '&country=espana';
	url += '&q=descripcion:' + encodeURIComponent(user.keywords.replace(/ /g, '*'));
	url += '&city=' + encodeURIComponent(user.city);

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

async function getOfferById(offerId) {
	let url = 'https://api.infojobs.net/api/7/offer/' + offerId;

	const res = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Basic ${INFOJOBS_API_KEY}`
		}
	});

	return await res.json();
}

module.exports = {
	getLastOffersByUser,
	getOfferById
};
