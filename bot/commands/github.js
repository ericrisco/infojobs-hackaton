const sendMarkdownMessage = require('../sendMarkdown');
const messages = require('../../language/messages.json');
const util = require('util');
const getUsername = require('../../ai/actions/username');
const { getGithubUsedTechnologies } = require('../../github/technologies');
const aboutMe = require('./aboutme');

async function extractTechnologies(chatId, message) {

    var github = await getUsername(chatId, message);
    if(github.username) {
        var technologies = await getGithubUsedTechnologies(github.username);
        if(technologies){
            await sendMarkdownMessage(chatId, util.format(messages.extractedTechnologies, technologies));
            await aboutMe(chatId, `he trabajado con ${technologies}`, true);
        }else{
            await sendMarkdownMessage(chatId, messages.githubTechnologiesNotFound);
        }
    }else{
        await sendMarkdownMessage(chatId, github.message);
    }
}

module.exports = {
	extractTechnologies
};