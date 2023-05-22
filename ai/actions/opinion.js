const { ChatCompletionRequestMessageRoleEnum } = require('openai');

const ai = require('../openai');
const sendMarkdownMessage = require('../../bot/sendMarkdown');
const AI_MODEL = process.env.AI_MODEL ?? '';
const OPEN_AI_RATE_LIMIT_RETRIES = process.env.OPEN_AI_RATE_LIMIT_RETRIES ?? 5;
const messages = require('../../language/messages.json');

const INITIAL_MESSAGES = [
	{
		role: ChatCompletionRequestMessageRoleEnum.System,
		content: `Imagina que eres un experto comparando ofertas de trabajo. Yo te voy a pasar el perfil de un posible candidato en formato json y la oferta de trabajo que ha encontrado
      tambien en formato json. 

      Tu trabajo sera crear un texto en primera persona diciendo si el candidato es apto para el puesto de trabajo o no dando razones de peso y si le recomiendas presentarse a la oferta o no.

      También le puedes proponer al usuario que podria hacer, por ejemplo estudiar, para poder presentarse y darle alguna recomendación.

      Devuelve solo el texto, nada mas, no hace falta que saludes. Un texto de máximo 200 letras. Usa algun emoji cuando lo veas necesario y utiliza una entonación amigable y de motivación.
     `
	}
];

async function getOpinion(user, offer, attempts = OPEN_AI_RATE_LIMIT_RETRIES) {
	try {
		const completion = await ai.createChatCompletion({
			model: AI_MODEL,
			temperature: 0,
			messages: [
				...INITIAL_MESSAGES,
				{
					role: ChatCompletionRequestMessageRoleEnum.User,
					content: `profile: ${JSON.stringify(user)} offer: ${JSON.stringify(offer)}`
				}
			]
		});

		const data = completion.data.choices[0].message?.content ?? '';
		return data;
	} catch (err) {
		if (err.response.status === 429 && attempts > 0) {
			sendMarkdownMessage(user.chatId, messages.giveMeTime);
			await new Promise((resolve) => setTimeout(resolve, 20000));
			return getOpinion(user, offer, attempts - 1);
		}
		return messages.aiError;
	}
}

module.exports = getOpinion;
