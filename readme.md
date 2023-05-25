# 🧠🧑‍💼 InfojobsGPT

InfojobsGPT is an innovative Telegram chatbot that utilizes the OpenAI API and the Infojobs API to assist individuals in their job search. Using the GPT-3 model, it allows for natural language interaction, removing the need for predefined commands. Besides assisting in job searching, InfojobsGPT can generate job profiles for users, formulate queries to the Infojobs API, evaluate job offers, and, of course, tell bad jokes to brighten up your day. Additionally, InfojobsGPT can send you a job offer that matches your profile every day.

## 📝 Try the bot

You can test the bot on Telegram at the following link: <a href="[http://example.com/](https://t.me/infojobsgpt_bot)" target="_blank">@infojobsgpt_bot</a>

## 💻 Features

1. **Natural Language Interaction**: Interact with the chatbot in natural language, without the need for predefined commands. Works the same as ChatGPT.
2. **Job Profile Generation**: Generate your job profiles through natural language.
3. **Job Profile Modification**: Modify job profiles through natural language.
4. **Job Search by Profile**: Use your job profile to formulate queries to the Infojobs API and get job offers.
5. **Job Search by Prompt**: Use a prompt to formulate queries to the Infojobs API and get job offers.
6. **Job Offer Evaluation**: Compare a job offer with your profile and get feedback.
7. **Bad Joke Generator**: Generate bad jokes related to AI, programming, and job searching.
8. **Daily Job Offers**: Sends a job offer to your Telegram based on your job profile each day.

## 💻 Technologies

    - [Node.js](https://nodejs.org/)
    - [OpenAI API](https://platform.openai.com/)
    - [Infojobs API](https://developer.infojobs.net/)
    - [Telegram API](https://core.telegram.org/)
    - [MongoDB](https://www.mongodb.com/)

## 📝 Installation

1. Clone the repository

    ```sh
    git clone
    ```

2. Install NPM packages

    ```sh
     npm install
    ```

3. Create a .env file with the following environment variables:

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

    You need a Telegram bot token, an Infojobs API key, a MongoDB URI, a MongoDB username, a MongoDB password, an OpenAI API token.

    - You can get a Telegram bot token by talking to the [BotFather](https://t.me/botfather).
    - You can get an Infojobs API key by talking to the [Infojobs API team](https://developer.infojobs.net/).
    - You can get an OpenAI API token by signing up for the [OpenAI API](https://beta.openai.com/).
    - You can get a MongoDB URI, a MongoDB username, and a MongoDB password by signing up for [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

4. Run the dev server

    ```sh
     npm run dev
    ```
