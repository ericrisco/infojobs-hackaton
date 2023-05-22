const { ChatCompletionRequestMessageRoleEnum } = require('openai');

const ai = require('../openai');
const aiModel = process.env.AI_MODEL ?? '';

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

async function getOpinion(user, offer) {
	try {
		const completion = await ai.createChatCompletion({
			model: aiModel,
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
		console.log(err);
		return 'Tengo el cerebro un poco saturado...';
	}
}

module.exports = getOpinion;
