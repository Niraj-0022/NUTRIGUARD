const express = require('express');
const bodyParser = require('body-parser');
// const { Configuration, OpenAIApi } = require('openai');
const OpenAI = require('openai');
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(express.static('public'));  // to serve static files like HTML, CSS, JS

// OpenAI API setup
// const configuration = new Configuration({
//     apiKey: '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',  // Replace with your actual OpenAI API key
// });
// const openai = new OpenAIApi(configuration);

const openai = new OpenAI({
    apiKey: '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',  // Replace with your actual OpenAI API key
});

// Route to handle ingredient checking
app.post('/check-ingredients', async (req, res) => {
    const { disease, ingredients } = req.body;
    console.log(disease,ingredients)
    try {
        const prompt = `A person with ${disease} wants to know if the following ingredients are safe to consume: ${ingredients}. Please give a response considering their condition.`;


        const completion = await openai.openai.completions.create({
            model: 'text-davinci-003',
            prompt: prompt,
            max_tokens: 150,
        });
        const message = completion.data.choices[0].text.trim();
        console.log("yyy",message)

        res.json({ message });
    } catch (error) {
        res.status(500).json({ error: 'Error communicating with OpenAI API' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);

});