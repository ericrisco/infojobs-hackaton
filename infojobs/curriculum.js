const CLIENT_ID = process.env.INFOJOBS_CLIENT_ID;
const CLIENT_SECRET = process.env.INFOJOBS_CLIENT_SECRET;
const BASIC_TOKEN = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
    "base64"
);

const CURRICULUM_URL = 'https://api.infojobs.net/api/2/curriculum';
const CURRICULUM_EXPERIENCE_URL = 'https://api.infojobs.net/api/2/curriculum/##CODE##/experience';
const CURRICULUM_SKILLS_URL = 'https://api.infojobs.net/api/2/curriculum/##CODE##/skill';

async function getPrincipalCurriculumId(token) {

	const res = await fetch(CURRICULUM_URL, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Basic ${BASIC_TOKEN}, Bearer ${token}`
		}
	});

    const json = await res.json();
    if (json.error) return null;

    const cv = json.filter((curriculum) => curriculum.principal === true)[0];

    if (json.error) return null;

	return cv.code;
}

async function getExperiences(token, curriculumId) {

    const url = CURRICULUM_EXPERIENCE_URL.replace('##CODE##', curriculumId);
	const res = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Basic ${BASIC_TOKEN}, Bearer ${token}`
		}
	});

    const json = await res.json();    
    if (json.error) return null;


    let experiences = json.experience.map((experience) => {
        const job = experience.job;
        const categories = experience.subcategories.join(", ");
        return `${job}, ${categories}`;
    });

    experiences = experiences.join(", ");
    let words = experiences.split(" ");
    let uniqueExperiences = Array.from(new Set(words));
    uniqueExperiences = uniqueExperiences.join(", ");

	return uniqueExperiences;
};

async function getSkills(token, curriculumId) {

    const url = CURRICULUM_SKILLS_URL.replace('##CODE##', curriculumId);
	const res = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Basic ${BASIC_TOKEN}, Bearer ${token}`
		}
	});

    const json = await res.json();
    
    if (json.error) return null;

    let expertises = json.expertise.map((expertises) => {
        return expertises.skill;
    });
    expertises = expertises.join(", ");

	return expertises;
};


module.exports = {
	getPrincipalCurriculumId,
    getExperiences,
    getSkills
};