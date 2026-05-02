# prepper-agent 🔍

A local codebase auditing tool that uses open-source LLMs via Ollama to generate structured summaries and flag potential bottlenecks in your code files.

Built as an experiment in running AI agents entirely on local hardware — no API keys, no cloud, no cost.

---

## What it does

Points the agent at a file path, and it returns a structured JSON audit containing:

- **fileName** — the file being analysed
- **summary** — a 1-sentence description of the file's purpose
- **bottlenecks** — a list of potential performance or structural issues

---

## Tech Stack

- [Ollama](https://ollama.com/) — local LLM inference
- [Zod](https://zod.dev/) — schema definition and output validation
- [zod-to-json-schema](https://github.com/StefanTerdell/zod-to-json-schema) — converts Zod schemas to JSON Schema for structured outputs

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Ollama](https://ollama.com/) installed and running locally
- A pulled Ollama model e.g.:

```bash
ollama pull gemma3:1b-it-qat
```

---

## Installation

```bash
git clone https://github.com/limiajayi/prepper-agent.git
cd prepper-agent
npm install
```

---

## Usage

Edit the `searchPath` variable in `index.mjs` to point at the file you want to audit:

```js
const searchPath = "./path/to/your/file.ts";
```

Then run:

```bash
node index.mjs
```

---

## Example Output

```json
{
  "fileName": "Projects.tsx",
  "summary": "Fetches and displays a list of GitHub repositories as project cards.",
  "bottlenecks": [
    "GitHub API called directly from the component with no caching",
    "No error boundary around the fetch logic"
  ]
}
```

---

## Findings & Limitations

This project was a learning experiment and hit some real constraints worth documenting:

- **Small models hallucinate aggressively** — `gemma3:270m` invented a hotel from a Python file and at one point *ran* the agent it was supposed to summarise

![gemma3:270m running the agent it was supposed to summarise](/assets/Hotel-Agent.png)

- **Context window is the main bottleneck** — input is sliced to 2000 characters to avoid overflow, which limits analysis quality
- **Structured output compliance is inconsistent** — smaller models don't reliably respect the JSON schema even when explicitly instructed
- **Quantised models don't save as much RAM as expected** — `gemma3:1b-it-qat` and `gemma3:270m` had near-identical RAM footprints at runtime

![gemma3:1b-it-qat giving the desired output](/assets/Desired-Output.png)

**Recommended minimum model:** `gemma3:4b` for meaningful code analysis results.
