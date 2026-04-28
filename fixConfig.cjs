const fs = require('fs');
let file = 'src/services/geminiOrchestrator.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/generationConfig:/g, 'config:');
fs.writeFileSync(file, content);
console.log("Fixed config in geminiOrchestrator");
