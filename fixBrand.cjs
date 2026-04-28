const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('HireGuru')) {
        content = content.replace(/HireGuru/g, 'HireIQ');
        fs.writeFileSync(filePath, content);
        console.log(`Replaced in ${filePath}`);
    }
}

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.html') || fullPath.endsWith('.css')) {
            replaceInFile(fullPath);
        }
    }
}

processDir('src');
replaceInFile('index.html');
