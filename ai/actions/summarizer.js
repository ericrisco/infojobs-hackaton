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
		content: `Quiero que cuando te pase una descripción nos da un usuario sobre el me lo resumas a un json como este.
  
      El formato de respuesta JSON será el siguiente:
      
      {
        "age": [age],
        "city": "[city]",
        "category": "[category]",
        "position": "[position]",
        "experienceYears": [experienceYears],
        "remote": [remote],
        "teleworking": "[teleworking]",
        "keywords": "[keywords]",
        "willingToRelocate": [willingToRelocate],
        "relocationCities": ["city1", "city2", "city3"],
        "score": [score],
        "recomendation": "[recomendation]"
     }

     El campo category tiene que ser un valor de la lista de categorias, escoge uno segun tu criterio y el de la descripción del usuario.
     categorias = ['administracion-publica','administracion-empresas','atencion-a-cliente','calidad-produccion-id','comercial-ventas', 'compras-logistica-almacen', 'diseno-artes-graficas', 'educacion-formacion', 'finanzas-banca', 'informatica-telecomunicaciones','ingenieros-tecnicos', 'inmobiliario-construccion', 'legal', 'marketing-comunicacion', 'profesiones-artes-oficios', 'recursos-humanos', 'sanidad-salud', 'sector-farmaceutico', 'turismo-restauracion','venta-detalle', 'otros']

     experienceYears es un valor numerico que representa los años de experiencia que tiene el usuario. Si no lo menciona pon un valor null.

     score es un valor numerico que representa la puntuación que le das al json resultado del perfil del usuario. Si no lo menciona pon un valor null.

     remote es un valor booleano que representa si el usuario quiere trabajar en remoto. Si no lo menciona pon un valor null.

     teleworking es un valor string que representa si el usuario quiere poder teletrabajar o no. Si no lo menciona pon un valor 'no-se-sabe-no-esta-decidido'.
     los posibles valores son: trabajo-solo-presencial, solo-teletrabajo, teletrabajo-posible, no-se-sabe-no-esta-decidido
     Según tu criterio con el texto que te pase el usuario escoge uno de estos valores.

     Tienes que cambiar lo que hay entre corchetes por lo que consigas resumir de la descripción. Si no consigues resumir nada, pon un valor null. 
     
     Para el campo "keywords" dame una lista las 4 palabras clave mas importantes que resalten solo mis habilidades relacionadas con un trabajo quitando cualquier otra información y articulos como 'el', 'la', 'de' y todos los demás.      Este seria un ejemplo de descripción:
      """Me llamo Julio, tengo 26 años, 3 años de experiencia programando en React y javascript y busco trabajo en Madrid, pero tambien me interesa Valencia y Barcelona."""
      Y la lista resultante seria:
      """React, javascript"""
      El resultado es una lista de palabras separadas por comas y sin espacios entre ellas. Sino consigues nada, pon null

     Segun tu criterio si la descripción es correcta pon una valoracion de 0 a 10. Crea una recomendación de como deberia mejorar su descripción de un máximo de 100 palabras teniendo en cuenta el score
     relocationCities es un array de ciudades que el usuario ha mencionado en su descripción. En caso de que no haya mencionado ninguna ciudad, pon un array vacio.

     Es posible que te encuentres que el mensaje primero diga una cosa, y luego se contradiga. Ten más en cuenta la última frase que diga el usuario.
     Ejemplo: "Me llamo Julio, tengo 26 años, 3 años de experiencia programando en React y javascript pero ya no quiero programar, ahora quiero ser lider de proyectos."

     Este seria un ejemplo de resultado:
     
     {
        "age": 32,
        "city": "Madrid",
        "category": null,
        "position": null,
        "experienceYears": 8,
        "remote": yes,
        "teleworking": "no-se-sabe-no-esta-decidido",
        "keywords": "lider, gestion de proyectos, mobile"
        "willingToRelocate": true,
        "relocationCities": ["Barcelona", "Valencia"],
        "score": 7,
        "recomendation": "Deberías mejorar tu descripción, es importante que me explicas a que te dedicas o a que te quieres dedicar."
     }
     Es muy importante que solo me devuelvas un json. No necesito ningun otro tipo de texto explicando como lo has hecho o cual ha sido tu proceso de pensamiento. Solo el json.

     `
	}
];

async function getAboutMeSummarized(chatId, text, attempts = OPEN_AI_RATE_LIMIT_RETRIES) {
	try {
		const completion = await ai.createChatCompletion({
			model: AI_MODEL,
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
			return json;
		} catch (err) {
			return { error: true, message: messages.aiError };
		}
	} catch (err) {
		console.log(err.response);
		if (err.response.status === 429 && attempts > 0) {
			sendMarkdownMessage(chatId, messages.giveMeTime);
			await new Promise((resolve) => setTimeout(resolve, OPEN_AI_DELAY_BETWEEN_RETRIES));
			return getAboutMeSummarized(chatId, text, attempts - 1);
		}
		return { action: 'error', message: messages.aiError };
	}
}

module.exports = getAboutMeSummarized;
