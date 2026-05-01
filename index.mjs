import ollama from 'ollama';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const Country = z.object({
    name: z.string(),
    capital: z.string(),
    languages: z.array(z.string()),
});

const response = await ollama.chat({
    model: 'gemma3:270m',
    messages: [{
        role: 'user', 
        content: `Tell me about Nigeria`
    }],
    format: 'json',
});

const country = Country.parse(JSON.parse(response.message.content));
console.log(country);