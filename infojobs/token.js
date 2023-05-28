const INFOJOBS_API_GET_TOKEN = "https://www.infojobs.net/oauth/authorize?grant_type=authorization_code&client_id=##CLIENT_ID##&client_secret=##CLIENT_SECRET##&code=##CODE##&redirect_uri=##CALLBACK_URL##";

async function getToken(chatId, code) {
			
    let tokenUrl = INFOJOBS_API_GET_TOKEN;
    tokenUrl = tokenUrl.replace('##CODE##', code);		
    tokenUrl = tokenUrl.replace('##CLIENT_ID##', process.env.INFOJOBS_CLIENT_ID);
    tokenUrl = tokenUrl.replace('##CLIENT_SECRET##', process.env.INFOJOBS_CLIENT_SECRET);
    tokenUrl = tokenUrl.replace('##CALLBACK_URL##', process.env.INFOJOBS_REDIRECT_URI);	

    const res = await fetch(tokenUrl, {
        method:"POST"
    })

    const data = await res.json();
    return data.access_token;
}

module.exports = {
	getToken
};
