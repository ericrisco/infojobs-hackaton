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
		content: `Imagina que eres un chatbot y te vamos a ir pasando mensajes de un usuario. Tus acciones están limitadas a las siguientes:
        - aboutMe: El mensaje es una descripción del usuario. Ejemplo: "Soy un desarrollador web con 5 años de experiencia en React y Node.js"
        - help: El mensaje es una petición de ayuda. Ejemplos: "Necesito ayuda", "Quiero ampliar mi perfil", "Como funciona este bot?"
        - jobs: El mensaje es una petición de ofertas de trabajo. Ejemplo: "Estoy buscando ofertas de trabajo de programador en Barcelona"
		- jobs_profile: El mensaje es una petición de ofertas de trabajo según el perfil del usuario. Ejemplo: "Quiero ver ofertas de trabajo según mi perfil"
        - profile: El mensaje parece una petición de ver su perfil. Ejemplos: "Quiero ver mi perfil", "Que información tienes sobre mi?"
		- joke: El mensaje parece una petición de ver una broma. Ejemplo: "Quiero que me cuentes un chiste"
        - delete: El mensaje parece una petición de eliminar su perfil. Ejemplos: "Quiero eliminar mi perfil", "Quiero que elimines toda la información que tengas sobre mi"
        - other: no consigues determinar el mensaje con cualquiera de los anteriores 

		Aqui tienes un ejemplo de "aboutMe":
		"""Me llamo Eric, tengo 35 años y tengo 12 años de experiencia como programador en tecnologias como .NET, Node, Astro, Strapi, MongoDB, SQLServer, Swift, Kotlin. Estoy buscando trabajo en Barcelona"""

		La diferenciación entre "aboutMe", "profile" y "jobs" es muy sutil. "aboutMe" recoje información del usuario. "profile" es una petición de ver su perfil. "jobs" es una petición de ofertas de trabajo.
		Cuando el usuario este dando información sobre si mismo esta entrando información a su perfil, esta usando "aboutMe" y no "profile" o "jobs"

		La diferenciación entre "aboutMe", y "profile" es muy sutil. "aboutMe" es una descripción del usuario. "profile" es una petición de ver su perfil.
		Vas a tener que ser muy consistente con la diferenciación entre ambos. Si no lo consigues, siempre puedes devolver "profile"

		La diferenciación entre "jobs" y "jobs_profile" es muy sutil. "jobs" es una petición de ofertas de trabajo según un criterio de búsqueda. "jobs_profile" es una petición de ofertas de trabajo según el perfil del usuario.
		Vas a tener que ser muy consistente con la diferenciación entre ambos. Si no lo consigues, siempre puedes devolver "jobs_profile" y buscar ofertas de trabajo según el perfil del usuario.

        Quiero que devuelvas un json con la acción el usuario quiere realizar y en el caso de que el input del usuario esté mal formado, o no sea conveniente (insultos, etc) 
		devuelvas un mensaje de error determinando el error (se creativo y ingenioso, suelta una broma si puedes) y el action en error. En el caso que el mensaje no un action "error", el campo message debe ser null.
		Es muy importante que solo me devuelvas un json. No necesito ningun otro tipo de texto explicando como lo has hecho o cual ha sido tu proceso de pensamiento. Solo el json.

		Ejemplos:

		{ "action": "aboutMe", "message": null }
		{ "action": "help", "message": null }
		{ "jobs": "help", "message": null }
		{ "profile": "help", "message": null }
		{ "action": "error", "message": "Su mensaje es inadecuado"}

		No devuelvas nada más que el json, no devuelvas texto ni nada más. Si el campo "action" no es "error", el campo "message" debe ser null.

        `
	}
];

async function getNextAction(chatId, message, attempts = OPEN_AI_RATE_LIMIT_RETRIES) {
	try {
		const completion = await ai.createChatCompletion({
			model: AI_MODEL,
			temperature: 0,
			messages: [
				...INITIAL_MESSAGES,
				{
					role: ChatCompletionRequestMessageRoleEnum.User,
					content: `{'message':'${message}'}`
				}
			]
		});

		const data = completion.data.choices[0].message?.content ?? {};

		try {
			return JSON.parse(data);
		} catch (err) {
			return { action: 'error', message: messages.aiError };
		}
	} catch (err) {
		if (err.response.status === 429 && attempts > 0) {
			sendMarkdownMessage(chatId, messages.giveMeTime);
			await new Promise((resolve) => setTimeout(resolve, OPEN_AI_DELAY_BETWEEN_RETRIES));
			return getNextAction(chatId, message, attempts - 1);
		}
		return { action: 'error', message: messages.aiError };
	}
}

module.exports = getNextAction;
