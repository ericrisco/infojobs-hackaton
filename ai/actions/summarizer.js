const { ChatCompletionRequestMessageRoleEnum } = require('openai');

const ai = require('../openai');
const aiModel = process.env.AI_MODEL ?? '';

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
        "keywords": "[keywords]",
        "other_city": [other_city],
        "others_city": ["city1", "city2", "city3"],
        "score": [score],
        "recomendation": "[recomendation]"
     }

     El campo category tiene que ser un valor de la lista de categorias, escoge uno segun tu criterio y el de la descripción del usuario.
     categorias = ['administracion-publica','administracion-empresas','atencion-a-cliente','calidad-produccion-id','comercial-ventas', 'compras-logistica-almacen', 'diseno-artes-graficas', 'educacion-formacion', 'finanzas-banca', 'informatica-telecomunicaciones','ingenieros-tecnicos', 'inmobiliario-construccion', 'legal', 'marketing-comunicacion', 'profesiones-artes-oficios', 'recursos-humanos', 'sanidad-salud', 'sector-farmaceutico', 'turismo-restauracion','venta-detalle', 'otros']

     experienceYears es un valor numerico que representa los años de experiencia que tiene el usuario. Si no lo menciona pon un valor null.

     score es un valor numerico que representa la puntuación que le das a la descripción del usuario. Si no lo menciona pon un valor null.

     remote es un valor booleano que representa si el usuario quiere trabajar en remoto. Si no lo menciona pon un valor null.

     Tienes que cambiar lo que hay entre corchetes por lo que consigas resumir de la descripción. Si no consigues resumir nada, pon un valor null. 
     
     El campo keywords quiero que resumas la descripción y se lo mas preciso y concreto y no añadas poblaciones. La lista que sea de maximo 4 palabras clave. Sin articulos "de", "el", "la" ni espacios, para separar las palabras pon un asterisco (*). Ejemplo: lider*gestion*proyectos*mobile
     
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
        "keywords": "lider, gestion de proyectos, mobile"
        "other_city": true,
        "others_city": ["Barcelona", "Valencia"],
        "score": 7,
        "recomendation": "Deberías mejorar tu descripción, es importante que me explicas a que te dedicas o a que te quieres dedicar."
     }
     `
	}
];

async function getAboutMeSummarized(text) {
	try {
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
			return json;
		} catch (err) {
         return { error: true, message: 'Tengo el cerebro un poco frito ahora mismo, puedes intentar un poco más tarde?' };
		}
	} catch (err) {
      return { error: true, message: 'Tengo el cerebro un poco frito ahora mismo, puedes intentar un poco más tarde?' };
	}
}

module.exports = getAboutMeSummarized;
