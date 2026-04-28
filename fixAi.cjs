const fs = require('fs');

function processFile(file) {
    let content = fs.readFileSync(file, 'utf8');

    // Remove old exact lines if present
    content = content.replace(/let aiInstance: GoogleGenAI \| null = null;\nfunction getAi\(\) \{\n  if \(\!aiInstance\) \{\n    aiInstance = new GoogleGenAI\(\{ apiKey: process\.env\.GEMINI_API_KEY \}\);\n  \}\n  return aiInstance;\n\}/g, '');
    content = content.replace(/const ai = new GoogleGenAI\(\{ apiKey: process\.env\.GEMINI_API_KEY \}\);/g, '');

    // Inject lazy load code
    const inject = `
let aiInstance: GoogleGenAI | null = null;
function getAi() {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  }
  return aiInstance;
}
`;
    // Put after imports
    content = content.replace(/import \{.*?\} from '@google\/genai';\n.*/, (match) => {
        return match + '\n' + inject;
    });

    content = content.replace(/\bai\.models/g, 'getAi().models');
    content = content.replace(/getAi\(\)\(\)/g, 'getAi()'); // just in case

    fs.writeFileSync(file, content);
    console.log("Processed " + file);
}

processFile('src/services/geminiOrchestrator.ts');
processFile('src/services/geminiInterviewOrchestrator.ts');
