require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');
const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// OpenAI API setup
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Securely store API key in .env file
});

// Route to handle ingredient checking
app.post('/check-ingredients', async (req, res) => {
    const { disease, ingredients } = req.body;
    console.log("disease, ingreadients", disease , ingredients)
    if (!disease || !ingredients) {
        return res.status(400).json({ error: 'Disease and ingredients are required' });
    }

    try {
        const prompt = `A person with ${disease} wants to know if the following ingredients are safe to consume: ${ingredients}. Please give a response considering their condition.`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 150,
        });

        const message = completion.choices[0].message.content.trim();
        res.json({ message });
    } catch (error) {
        console.error('Error communicating with OpenAI API:', error.message);
        res.status(500).json({ error: 'Error communicating with OpenAI API' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
