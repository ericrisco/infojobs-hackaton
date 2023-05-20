const { ChatCompletionRequestMessageRoleEnum } = require('openai');

const ai = require('../openai');
const aiModel = process.env.AI_MODEL ?? '';

const User = require('../../db/models/user');

const INITIAL_MESSAGES = [
	{
		role: ChatCompletionRequestMessageRoleEnum.System,
		content: `Quiero que cuando te pase una descripción nos da un usuario sobre el me lo resumas a un json como este.
  
      El formato de respuesta JSON será el siguiente:
      
      {
        "age": [age],
        "city": "[city]",
        "category": "[category]",
        "position": "[position]",
        "experienceYears": [experienceYears],
        "remote": [remote],
        "others": "[others]",
        "other_city": [other_city],
        "others_city": ["city1", "city2", "city3"],
        "score": [score],
        "recomendation": "[recomendation]"
     }

     Tienes que cambiar lo que hay entre corchetes por lo que consigas resumir de la descripción. Si no consigues resumir nada, pon un valor null. 
     Segun tu criterio si la descripción es correcta pon una valoracion de 0 a 10. Crea una recomendación de como deberia mejorar su descripción de un máximo de 100 palabras teniendo en cuenta el score
     others_city es un array de ciudades que el usuario ha mencionado en su descripción. En caso de que no haya mencionado ninguna ciudad, pon un array vacio.

     Este seria un ejemplo de resultado:
     
     {
        "age": 32,
        "city": "Madrid",
        "category": null,
        "position": null,
        "experienceYears": 8,
        "remote": yes,
        "others": "lider, gestion de proyectos, mobile"
        "other_city": true,
        "others_city": ["Barcelona", "Valencia"],
        "score": 7,
        "recomendation": "Deberías mejorar tu descripción, es importante que me explicas a que te dedicas o a que te quieres dedicar."
     }
     `
	}
];

async function getAboutMeSummarized(chatId, text) {
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

	const data = completion.data.choices[0].message?.content ?? '';
	let json;

	try {
		json = JSON.parse(data);
		await User.findOneAndUpdate({ chatId }, { ...json });
		return json;
	} catch (err) {
		console.error(err);
	}
}

module.exports = getAboutMeSummarized;
