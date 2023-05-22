const { ChatCompletionRequestMessageRoleEnum } = require('openai');

const ai = require('../openai');
const sendMarkdownMessage = require('../../bot/sendMarkdown');
const AI_MODEL = process.env.AI_MODEL ?? '';
const OPEN_AI_RATE_LIMIT_RETRIES = process.env.OPEN_AI_RATE_LIMIT_RETRIES ?? 5;
const messages = require('../../language/messages.json');

const INITIAL_MESSAGES = [
	{
		role: ChatCompletionRequestMessageRoleEnum.System,
		content: `
        Quiero que escojas una sola tematica entre las siguientes y te inventes un chiste creativo y original:
        """
        - Buscar trabajo
        - Entrevistas de trabajo
        - Curriculum
        - Trabajo remoto
        - Trabajo freelance
        - Trabajo en equipo
        - Trabajo en equipo remoto
        - Inteligencia artificial
        """
        Puedes usar el humor que quieras, pero no seas ofensivo.

        Solo contestame con un solo chiste. Si no me gusta, te lo hare saber. Si me gusta, te lo hare saber tambien.
     `
	}
];

async function getJoke(chatId, attempts = OPEN_AI_RATE_LIMIT_RETRIES) {
	try {
		const completion = await ai.createChatCompletion({
			model: AI_MODEL,
			temperature: 0.8,
			messages: [...INITIAL_MESSAGES]
		});

		const data = completion.data.choices[0].message?.content ?? '';
		return data;
	} catch (err) {
		if (err.response.status === 429 && attempts > 0) {
			sendMarkdownMessage(chatId, messages.giveMeTime);
			await new Promise((resolve) => setTimeout(resolve, 20000));
			return getJoke(chatId, attempts - 1);
		}
		return messages.aiError;
	}
}

module.exports = getJoke;
