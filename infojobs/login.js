const INFOJOBS_API_LOGIN_URL = "https://www.infojobs.net/api/oauth/user-authorize/index.xhtml?scope=MY_APPLICATIONS,CANDIDATE_PROFILE_WITH_EMAIL,CANDIDATE_READ_CURRICULUM_SKILLS,CV,CANDIDATE_READ_CURRICULUM_EXPERIENCE&client_id=##CLIENT_ID##&redirect_uri=##CALLBACK_URL##&response_type=code&state=##CHAT_ID##";

async function getLoginUrl(chatId) {
    let callbackUrl = INFOJOBS_API_LOGIN_URL;
    callbackUrl = callbackUrl.replace('##CLIENT_ID##', process.env.INFOJOBS_CLIENT_ID);
    callbackUrl = callbackUrl.replace('##CALLBACK_URL##', process.env.INFOJOBS_REDIRECT_URI);
    callbackUrl = callbackUrl.replace('##CHAT_ID##', chatId);
    return callbackUrl;
}

module.exports = {
	getLoginUrl
};
