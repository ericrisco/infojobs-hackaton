const messages = require('../language/messages.json');

async function errorHandling(bot, chatId, error) {
    console.error(error);
    bot.sendMessage(chatId, messages.errorMessage, { parse_mode: "MarkdownV2" });
}

module.exports = errorHandling