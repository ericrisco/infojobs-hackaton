const { ChatCompletionRequestMessageRoleEnum } = require('openai');

const ai = require('../openai');
const aiModel = process.env.AI_MODEL ?? '';

var INITIAL_MESSAGES = [
	{
		role: ChatCompletionRequestMessageRoleEnum.System,
		content: `Crea un mensaje muy parecido al mensaje que te paso pero cambiando algunas cosas. no hables nunca en tercera persona

        Utiliza con emojis, utiliza negritas y subrayados marcandolos con html
        
        Devuelve solo el mensaje que has creado, nada mas, sin los asteriscos que te he pasado
        `
	}
];

async function generateAiMessage(text) {
	const completion = await ai.createChatCompletion({
		model: aiModel,
		temperature: 0,
		messages: [
			...INITIAL_MESSAGES,
			{
				role: ChatCompletionRequestMessageRoleEnum.User,
				content: text
			}
		]
	});

	const aiMessage = completion.data.choices[0].message?.content ?? '';
	return aiMessage;
}

module.exports = generateAiMessage;
