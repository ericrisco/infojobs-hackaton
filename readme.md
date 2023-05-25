# 🧠🧑‍💼 InfojobsGPT

InfojobsGPT es un chatbot innovador de Telegram que utiliza la API de OpenAI y la API de Infojobs para ayudar a las personas en su búsqueda de empleo. Utilizando el modelo GPT-3, permite la interacción en lenguaje natural, eliminando la necesidad de comandos predefinidos. Además de ayudar en la búsqueda de trabajo, InfojobsGPT tiene la capacidad de generar perfiles laborales para los usuarios, formular consultas a la API de Infojobs, evaluar ofertas de trabajo y, por supuesto, hacer chistes malos para alegrarte el día. Además, InfojobsGPT puede enviarte una oferta de trabajo que se ajuste a tu perfil todos los días.

## 📝 Prueba el bot

Puedes probar el bot en Telegram en el siguiente enlace: [@infojobsgpt_bot](https://t.me/infojobsgpt_bot)

## 💻 Características

1. **Interacción en lenguaje natural**: Interacción con el chatbot en lenguaje natural, sin necesidad de comandos predefinidos. El mismo funcionamiento que ChatGPT
2. **Generación de perfiles laborales**: Generar tu perfiles laborales a través en lenguaje natural.
3. **Modificación de perfil laboral**: Modifica perfiles laborals a través de lenguaje natural.
4. **Buscador de trabajo por perfil**: Mediante el perfil laboral, formula consultas a la API de Infojobs para obtener ofertas de trabajo
5. **Buscador de trabajo por prompt**: Mediante un prompt, formula consultas a la API de Infojobs para obtener ofertas de trabajo
6. **Evaluación de ofertas de trabajo**: Compara una oferta de trabajo con tu perfil y te da su opinión.
7. **Generador de chistes malos**: Genera chistes malos relacionados con la IA, la programación y la busqueda de trabajo.
8. **Ofertas de trabajo diarias**: Envia una oferta de trabajo al dia a tu Telegram basandose en tu perfil laboral.

## 💻 Tecnologías

- Node.js[https://nodejs.org/es/]
- OpenAI API[https://platform.openai.com/]
- Infojobs API[https://developer.infojobs.net/]
- Telegram API[https://core.telegram.org/]
- MongoDB[https://www.mongodb.com/]

## 📝 Instalación

1. Clona el repositorio

   ```sh
   git clone
   ```

2. Instala los paquetes de NPM

   ```sh
    npm install
    ```

3. Crea un archivo .env con las siguientes variables de entorno:

   ```sh
    PORT=5000
    TELEGRAM_TOKEN=xxx
    INFOJOBS_API_KEY=xxx
    MONGODB_URI="mongodb+srv://<username>:<password>@xxx/xxx"
    MONGODB_USERNAME=xxx
    MONGODB_PASSWORD=xxx
    OPENAI_TOKEN=xxx
    AI_MODEL=gpt-3.5-turbo
    OPEN_AI_RATE_LIMIT_RETRIES=5
    OPEN_AI_DELAY_BETWEEN_RETRIES=20000
   ```

4. Ejecuta el servidor

   ```sh
    npm run dev
    ```
