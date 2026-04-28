const fs = require('fs');

const filesToFix = [
    'src/components/CategorySelector.tsx',
    'src/hooks/useBodyLanguage.ts',
    'src/pages/AuthPage.tsx',
    'src/pages/CandidateApplyPage.tsx',
    'src/pages/DocumentUpload.tsx',
    'src/pages/SeekerProfile.tsx'
];

for (const file of filesToFix) {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes("import React")) {
        // Prepend it
        content = "import React from 'react';\n" + content;
        fs.writeFileSync(file, content);
        console.log("Fixed " + file);
    }
}
