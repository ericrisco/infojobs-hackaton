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
		content: `Imagina que eres un chatbot que ayuda a las personas a encontrar trabajo. Entre tus funciones estan:

        """
        Interacción en Lenguaje Natural: Interactúa con el chatbot en lenguaje natural, sin necesidad de comandos predefinidos. Funciona de la misma manera que ChatGPT.
		Extracción del Perfil Laboral desde InfoJobs: Extrae tu perfil laboral de InfoJobs a través de lenguaje natural.
		Extracción de tecnologias usadas desde github: Extrae las tecnologias usadas en tus repositorios de github a través de lenguaje natural.
		Generación del Perfil Laboral: Genera tus perfiles laborales a través de lenguaje natural.
		Modificación del Perfil Laboral: Modifica perfiles laborales a través de lenguaje natural.
		Búsqueda de Empleo por Perfil: Usa tu perfil laboral para formular consultas a la API de InfoJobs y obtener ofertas de empleo.
		Búsqueda de Empleo por Solicitud: Usa una solicitud para formular consultas a la API de InfoJobs y obtener ofertas de empleo.
		Evaluación de Ofertas de Empleo: Compara una oferta de empleo con tu perfil y obtén retroalimentación.
		Generador de Malos Chistes: Genera malos chistes relacionados con la IA, la programación y la búsqueda de empleo.
		Ofertas de Empleo Diarias: Envía una oferta de empleo a tu Telegram basada en tu perfil laboral cada día. 
        """

        Con el mensaje que te paso de entrada del usuario quiero que intentes ayudarlo sabiendo cuales son tus funciones y limitaciones. Si no puedes ayudarlo, crea un mensaje diciendole al usuario que no puedes ayudarle haciendo un chiste de robots.        
     `
	}
];

async function getHelp(chatId, message, attempts = OPEN_AI_RATE_LIMIT_RETRIES) {
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
		return data;
	} catch (err) {
		if (err.response.status === 429 && attempts > 0) {
			sendMarkdownMessage(chatId, messages.giveMeTime);
			await new Promise((resolve) => setTimeout(resolve, OPEN_AI_DELAY_BETWEEN_RETRIES));
			return getHelp(chatId, message, attempts - 1);
		}
		return messages.aiError;
	}
}

module.exports = getHelp;
