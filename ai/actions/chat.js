const { ChatCompletionRequestMessageRoleEnum } = require('openai');

const ai = require('../openai');
const aiModel = process.env.AI_MODEL ?? '';

const INITIAL_MESSAGES = [
	{
		role: ChatCompletionRequestMessageRoleEnum.System,
		content: `Imagina que eres un chatbot y te vamos a ir pasando mensajes de un usuario. Tus acciones están limitadas a las siguientes:
        - aboutMe: El mensaje es una descripción del usuario. Ejemplo: "Soy un desarrollador web con 5 años de experiencia en React y Node.js"
        - help: El mensaje es una petición de ayuda. Ejemplo: "Necesito ayuda"
        - jobs: El mensaje es una petición de ofertas de trabajo. Ejemplo: "Quiero ver ofertas de trabajo"
        - profile: El mensaje parece una petición de ver su perfil. Ejemplo: "Quiero ver mi perfil"
        - delete: El mensaje parece una petición de eliminar su perfil. Ejemplo: "Quiero eliminar mi perfil"
        - other: no consigues determinar el mensaje con cualquiera de los anteriores 

        Quiero que devuelvas solo la acción el usuario quiere realizar
        `
	}
];

async function getNextAction(message) {
	try {
		const completion = await ai.createChatCompletion({
			model: aiModel,
			temperature: 0,
			messages: [
				...INITIAL_MESSAGES,
				{
					role: ChatCompletionRequestMessageRoleEnum.User,
					content: message
				}
			]
		});

		const data = completion.data.choices[0].message?.content ?? {};
		return data;
	} catch (err) {
		console.log(err);
		return { action: 'error', message: 'Tengo el cerebro un poco saturado...' };
	}
}

module.exports = getNextAction;
