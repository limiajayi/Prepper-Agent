
import ollama from 'ollama';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import fs from 'fs/promises';
import path from 'path';

const FileAuditSchema = z.object({
    fileName: z.string(),
    summary: z.string().describe("A 1-sentence summary of this file's purpose"),
    bottlenecks: z.array(z.string()).describe("Potential bottlenecks or performance issues")
});

const auditFile = async (filePath) => {
    try {
        
        const content = await fs.readFile(filePath, 'utf-8');
        const fileName = path.basename(filePath);

        console.log(`Analyzing ${fileName}...`);

        const response = await ollama.chat({
            model: 'gemma3:270m',
            messages: [{
                role: 'user', 
                content: `Analyze this code and return ONLY a JSON object with fileName, summary, and bottlenecks fields. No extra fields. \n\n${content.slice(0, 2000)}`
            }],
            format: zodToJsonSchema(FileAuditSchema, { target: 'openApi3' }),
        });

        const audit = JSON.parse(response.message.content);
        console.log('Audit Result: \n\n', audit);

        return audit;

    } catch (error) {
        console.error("Audit failed", error)
    }
}

auditFile('../travelling-agent/ai_travel_planner/agent.py');