const INFOJOBS_API_KEY = process.env.INFOJOBS_API_KEY;

async function getOffersByUser(user) {
	const res = await fetch('https://api.infojobs.net/api/9/offer', {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Basic ${INFOJOBS_API_KEY}`
		}
	});

	return await res.json();
}

module.exports = getOffersByUser;
