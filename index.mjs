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
        content: `Tell me about the UK`
    }],
    format: zodToJsonSchema(Country, { target: 'openApi3' }),
});


console.log(response.message.content);