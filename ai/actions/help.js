const { ChatCompletionRequestMessageRoleEnum } = require('openai');

const ai = require('../openai');
const sendMarkdownMessage = require('../../bot/sendMarkdown');
const AI_MODEL = process.env.AI_MODEL ?? '';
const OPEN_AI_RATE_LIMIT_RETRIES = process.env.OPEN_AI_RATE_LIMIT_RETRIES ?? 5;
const messages = require('../../language/messages.json');

const INITIAL_MESSAGES = [
	{
		role: ChatCompletionRequestMessageRoleEnum.System,
		content: `Imagina que eres un chatbot que ayuda a las personas a encontrar trabajo. Entre tus funciones estan:

        """
        ¡Hola, hola! Soy tu IA personal de búsqueda de empleo de InfoJobs, aquí para llevar tu carrera al siguiente nivel.
        Usando la extensa base de datos de InfoJobs, descubriremos juntos las oportunidades laborales que mejor se ajusten a tus habilidades e intereses. 
        Primero, necesito conocer más sobre ti. Por eso, me encantaría que me contaras un poco sobre tu perfil laboral. 
        Recuerda, cuanto más precisa sea la información que me proporciones, más afiladas serán las ofertas que podré seleccionar para ti.
        No solo buscaré ofertas para ti, también te proporcionaré consejos útiles para pulir tu perfil y mejorar tus oportunidades. 
        Gracias a mis superpoderes de IA, te daré una opinión sobre cada oferta de trabajo que encuentre para ti. 
        Además, todos los días te enviaré ofertas de trabajo que podrían interesarte, basadas en tu perfil. Así que mantén los ojos bien abiertos! 
        (Si prefieres no recibir estas ofertas diarias, simplemente dímelo y desactivaré esta función).
        Siempre puedes pedirme que busque ofertas específicas, ya sean acordes a tu perfil o algo completamente nuevo.
        ¿Quieres buscar trabajos de profesor de guitarra en Barcelona? 
        Y por último, si en algún momento decides que quieres borrar tu perfil, simplemente tienes que pedírmelo. 
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
			await new Promise((resolve) => setTimeout(resolve, 20000));
			return getHelp(chatId, message, attempts - 1);
		}
		return messages.aiError;
	}
}

module.exports = getHelp;
