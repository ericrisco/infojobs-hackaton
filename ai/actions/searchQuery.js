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
		content: `Imagina que eres un chatbot que usa la API de Infojobs para buscar ofertas de trabajo a partir del input del usuario
		Es muy importante que solo me devuelvas un json. No necesito ningun otro tipo de texto explicando como lo has hecho o cual ha sido tu proceso de pensamiento. Solo el json.

		Algunos ejemplos de input del usuario son:
		- Busco ofertas de trabajo de desarrollador en Madrid o Tarragona
		- Busco una oferta de trabajo de maestro de guitarra en Barcelona
		- Busco ofertas de trabajo de camarero en Valencia

		Tu trabajo será transformar este input en un json que usaremos para para hacer querys a la API de Infojobs. Teniendo en cuenta los ejemplos anteriores, el json que deberías generar sería algo así:
		- { "keywords": "desarrollador", "cities": ["Madrid", "Tarragona"], "category": "informatica-telecomunicaciones" }
		- { "keywords": "maestro*guitarra", "cities": ["Barcelona"], "category": "educacion-formacion" }
		- { "keywords": "camarero", "cities": ["Valencia"], "category": "turismo-restauracion" }

		El campo keywords quiero que resumas la descripción y se lo mas preciso y concreto y no añadas poblaciones. La lista que sea de maximo 4 palabras clave. Sin articulos "de", "el", "la" ni espacios, para separar las palabras pon un asterisco (*). Ejemplo: lider*gestion*proyectos*mobile

		El campo category tiene que ser un valor de la lista de categorias, escoge uno segun tu criterio y el texto que nos da el usuario.
    	categorias = ['administracion-publica','administracion-empresas','atencion-a-cliente','calidad-produccion-id','comercial-ventas', 'compras-logistica-almacen', 'diseno-artes-graficas', 'educacion-formacion', 'finanzas-banca', 'informatica-telecomunicaciones','ingenieros-tecnicos', 'inmobiliario-construccion', 'legal', 'marketing-comunicacion', 'profesiones-artes-oficios', 'recursos-humanos', 'sanidad-salud', 'sector-farmaceutico', 'turismo-restauracion','venta-detalle', 'otros']

     `
	}
];

async function createSearchQuery(chatId, text, attempts = OPEN_AI_RATE_LIMIT_RETRIES) {
	try {
		const completion = await ai.createChatCompletion({
			model: AI_MODEL,
			temperature: 0,
			messages: [
				...INITIAL_MESSAGES,
				{
					role: ChatCompletionRequestMessageRoleEnum.User,
					content: `{'text':'${text}'}`
				}
			]
		});

		const data = completion.data.choices[0].message?.content ?? '';
		let json;

		try {
			json = JSON.parse(data);
			return json;
		} catch (err) {
			return null;
		}
	} catch (err) {
		if (err.response.status === 429 && attempts > 0) {
			sendMarkdownMessage(chatId, messages.giveMeTime);
			await new Promise((resolve) => setTimeout(resolve, OPEN_AI_DELAY_BETWEEN_RETRIES));
			return createSearchQuery(chatId, text, attempts - 1);
		}
		return null;
	}
}

module.exports = createSearchQuery;
