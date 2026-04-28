const fs = require('fs');

const fixFile = (filePath) => {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    content = content.replace(
        "import { db, auth } from '../lib/firebase';",
        "import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';"
    );
    
    // Add handleFirestoreError(error, OperationType.UPDATE, "path"); inside completeOnboarding where it catches error
    if (content.includes("console.error(error);")) {
       content = content.replace(
           "console.error(error);",
           "console.error(error); if(auth.currentUser){ handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser.uid}`); }"
       );
    }
    
    fs.writeFileSync(filePath, content);
    console.log("Fixed", filePath);
};

fixFile('src/pages/JobSeekerOnboarding.tsx');
fixFile('src/pages/OnboardingWizard.tsx');
