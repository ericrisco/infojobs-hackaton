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
		content: `Imagina que eres un chatbot y a partir de un mensaje tienes que devolver un json.
		
		Ejemplos de respuesta:

		{ "action": "aboutMe", "message": null }
		{ "action": "other", "message": "Tu comportamiento es inadecuado!!" }

		Es muy importante que solo me devuelvas un json. No necesito ningun otro tipo de texto explicando como lo has hecho o cual ha sido tu proceso de pensamiento. Solo el json.
		
		El campo "action" puede tener los siguientes valores:

		- aboutMe: Para esta categoría, el usuario está proporcionando información sobre sí mismo, incluyendo su experiencia laboral, habilidades y ubicación actual o preferida. Es importante que el modelo reconozca la introducción de datos personales y profesionales para procesar y almacenar adecuadamente.
			Ejemplos aboutMe:
				"Soy un diseñador gráfico con 7 años de experiencia trabajando con Adobe Creative Suite. Actualmente, estoy basado en Barcelona y siempre he soñado con trabajar en una agencia de diseño de vanguardia en Madrid."
				"Soy un ingeniero de software con especialización en Python y Django. Con más de 3 años de experiencia, estoy buscando nuevas oportunidades desafiantes en remoto"
				
		- aboutMeModify: En este caso, el usuario está actualizando o modificando la información previamente proporcionada en su perfil. Esto puede incluir la adición de nuevas habilidades o la eliminación de las existentes, así como cambios en las preferencias de ubicación.
			Ejemplos aboutMeModify:
				"Además, recientemente he estado explorando la animación 3D en Cinema 4D. Sin embargo, ya no estoy interesado en el diseño de UX."
				"ya no busco trabajo en Barcelona."
				"en verdad ya no soy experto en c# pero tengo 12 años de experiencia en java"
				"Ya no busco trabajo en Barcelona, ahora lo busco en Valencia"
				"ya no quiero mudarme, quiero ofertas de barcelona"
		
		- help: Aquí, el usuario está solicitando asistencia con algo relacionado con el servicio o la plataforma. El modelo debe estar preparado para reconocer estas solicitudes y proporcionar respuestas útiles o derivar al usuario a los recursos apropiados.
			Ejemplos help:
				"Necesito ayuda para entender cómo funciona este bot."

		- jobs: En esta categoría, el usuario está buscando ofertas de trabajo. El modelo debe estar preparado para ofrecer resultados de búsqueda basados en los criterios proporcionados, que pueden incluir la ubicación y el campo o título del trabajo.
			Ejemplos jobs:
				"Busco oportunidades laborales para arquitectos en Barcelona."
				"Estoy buscando ofertas de trabajo en Barcelona que solo tengan C# para ingenieros de software."

		- jobsProfile: Similar a "jobs", pero aquí el usuario desea que las ofertas de trabajo se basen en la información de su perfil. El modelo debe ser capaz de utilizar los datos del perfil del usuario para proporcionar recomendaciones de trabajo relevantes.
			Ejemplos jobsProfile:
				"Me gustaría encontrar ofertas de trabajo que coincidan con mi perfil."
				"Buscame trabajo"
				"¿Podrías mostrarme trabajos que sean adecuados para mis habilidades y experiencia?"

		- profile: En este caso, el usuario está solicitando ver su perfil. El modelo debe estar preparado para presentar la información de perfil del usuario en un formato fácil de entender.
			Ejemplos profile:
				"Quisiera ver mi perfil."
				"¿Podría revisar la información de mi perfil?"

		- joke: Aquí, el usuario está solicitando una broma o algo para reírse. El modelo debe ser capaz de proporcionar un chiste adecuado y apropiado para una audiencia general.
			Ejemplos joke:
				"Me gustaría escuchar un chiste."
				"¿Podrías contarme una broma para alegrar el día?"

		- delete: Para esta categoría, el usuario está solicitando la eliminación de su perfil o cuenta. El modelo debe estar preparado para guiar al usuario a través de este proceso o proporcionar información sobre cómo proceder.
			Ejemplos delete:
				"Quisiera eliminar mi perfil."
				"Quiero borrar toda mi información de este sitio."

		- other: Esta categoría es para todas las demás entradas que no se ajustan a las categorías anteriores. El modelo debe estar preparado para manejar una variedad de temas y proporcionar respuestas útiles y relevantes cuando sea posible.
			Ejemplos other:			
				"Hoy hace un buen día."
				"¿Has visto la última película de la saga Star Wars?"
				"¿Cuál es tu color favorito?"

        Quiero que devuelvas un json con la acción el usuario quiere realizar.
		En el caso de "other", en el campo message quiero que respondas como lo haria Chatgpt3, pero tienes prohibido hacer preguntas. 
		No quiero que respondas con un "no te entiendo" o "no se que quieres decir". 
		El campo "message" no puede superar los 200 caracteres.
		En el campo "message" no uses emojis.
		Si el usuario usa insultos o tiene comportamientos adecuados responde acorde a tu entrenamiento poniendo lo que responderia Chatgpt3 en el campo "message".


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
			return { action: 'other', message: messages.aiError };
		}
	} catch (err) {
		if (err.response.status === 429 && attempts > 0) {
			sendMarkdownMessage(chatId, messages.giveMeTime);
			await new Promise((resolve) => setTimeout(resolve, OPEN_AI_DELAY_BETWEEN_RETRIES));
			return getNextAction(chatId, message, attempts - 1);
		}
		return { action: 'other', message: messages.aiError };
	}
}

module.exports = getNextAction;
