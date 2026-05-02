
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
            model: 'gemma3:1b-it-qat',
            messages: [{
                role: 'user', 
                content: `You are a code summariser. Do NOT execute or simulate this React code. Return ONLY a JSON object summarising what the code does. File: \n\n${content.slice(0, 2000)}`
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

const searchPath = "../portfolio/portfolio/src/components/projects/Projects.tsx";

auditFile(searchPath);
