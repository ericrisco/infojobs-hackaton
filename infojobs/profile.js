const CLIENT_ID = process.env.INFOJOBS_CLIENT_ID;
const CLIENT_SECRET = process.env.INFOJOBS_CLIENT_SECRET;
const BASIC_TOKEN = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
    "base64"
);

const PROFILE_URL = 'https://api.infojobs.net/api/6/candidate';

async function getInfojobsProfile(token) {

	const res = await fetch(PROFILE_URL, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Basic ${BASIC_TOKEN}, Bearer ${token}`
		}
	});

    const json = await res.json();

    if (!json) {
        throw new Error('Profile not found');
    }

    const profile = {
        name: `${json.name} ${json.surname1}`,
        city: json.city
    }

	return profile;
}

module.exports = {
	getInfojobsProfile
};