const { Configuration, OpenAIApi } = require('openai');

const openAIToken = process.env.OPENAI_TOKEN ?? '';

const configuration = new Configuration({ apiKey: openAIToken });
const ai = new OpenAIApi(configuration);

module.exports = ai;
