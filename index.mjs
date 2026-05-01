import ollama from 'ollama';

const response = await ollama.chat({
    model: 'gemma3:270m',
    messages: [{role: 'user', content: 'Hello!'}],
});

console.log(response.message.content);