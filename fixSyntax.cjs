const fs = require('fs');
const files = ['src/components/FloatingChat.tsx', 'src/pages/DashboardLayout.tsx', 'src/pages/DashboardHome.tsx', 'src/pages/LandingPage.tsx', 'src/pages/OnboardingWizard.tsx', 'src/pages/JobSeekerOnboarding.tsx', 'src/pages/InterviewRoom.tsx'];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(/\\`/g, '`').replace(/\\\$/g, '$');
        fs.writeFileSync(file, content);
        console.log("Fixed", file);
    }
});
