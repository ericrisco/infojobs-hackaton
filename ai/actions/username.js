const { ChatCompletionRequestMessageRoleEnum } = require('openai');

const ai = require('../openai');
const sendMarkdownMessage = require('../../bot/sendMarkdown');
const AI_MODEL = process.env.AI_MODEL ?? '';
const OPEN_AI_RATE_LIMIT_RETRIES = process.env.OPEN_AI_RATE_LIMIT_RETRIES ?? 5;
const OPEN_AI_DELAY_BETWEEN_RETRIES = process.env.OPEN_AI_DELAY_BETWEEN_RETRIES ?? 20000;
const messages = require('../../language/messages.json');

const INITIAL_MESSAGES = [
	{
		role: ChatCompletionRequestMessageRoleEnum.System,
		content: `
		Quiero que de un mensaje de entrada del usuario intentes extraer el nombre de usuario de github. El usuario puede escribir cualquier cosa, pero tu tienes que ser capaz de extraer el nombre de usuario de github.
		
		Ejempos de entrada:
		"Mi usuario de github es midudev"
		"Mi usuario de github es ericrisco"
		"Quiero que cojas mi perfil de github, mi usuario es ericrisco"
		"Coje mi perfil de github"

		Quiero que devuelvas un json con el "username" y un "message".
		El "message" puede ser null o un mensaje de error si no has podido extraer el usuario de github.
		El "username" puede ser null o el nombre de usuario de github.
		Si el "username" no es null, entonces el "message" tiene que ser null.
		Si el "message" no es null, entonces el "username" tiene que ser null.
		No quiero que me expliques como has llegado al resultado ni nada mas, solo quiero el JSON.
		
		Ejemplos de respuesta:

		{ "username": "aboutMe", "message": null }
		{ "username": null, "message": "No me has informado el usuario de Github" }
     `
	}
];

async function getUsername(chatId, message, attempts = OPEN_AI_RATE_LIMIT_RETRIES) {
	try {
		const completion = await ai.createChatCompletion({
			model: AI_MODEL,
			temperature: 0,
			messages: [
				...INITIAL_MESSAGES,
				{
					role: ChatCompletionRequestMessageRoleEnum.User,
					content: message
				}
			]
		});

		const data = completion.data.choices[0].message?.content ?? '';

		try {
			return JSON.parse(data);
		} catch (err) {
			return { action: 'other', message: message.promptError };
		}
	} catch (err) {
		if (err.response.status === 429 && attempts > 0) {
			sendMarkdownMessage(chatId, messages.giveMeTime);
			await new Promise((resolve) => setTimeout(resolve, OPEN_AI_DELAY_BETWEEN_RETRIES));
			return getUsername(chatId, message, attempts - 1);
		}
		return { username: null, message: messages.aiError };
	}
}

module.exports = getUsername;
