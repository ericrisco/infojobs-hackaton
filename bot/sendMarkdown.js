async function sendMarkdownMessage(bot, chatId, message) {
    console.log(message);
    await bot.sendMessage(chatId, message, { parse_mode: "HTML" });
}

module.exports = sendMarkdownMessage