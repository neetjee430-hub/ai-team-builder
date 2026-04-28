const fs = require('fs');
const path = './src/pages/LandingPage.tsx';
let data = fs.readFileSync(path, 'utf8');
const lines = data.split('\n');
const fixedLines = lines.map(line => {
    if (line.includes('const businessItems')) {
        return '    const businessItems = "💇 Salon • 🏋️ Gym • 📚 Coaching • 🍽️ Restaurant • 🏥 Clinic • 👗 Boutique • 🎓 School • ☕ Café • 🏠 Real Estate • 🚗 Driving School • 💊 Pharmacy • 📸 Studio • 🏨 Hotel • 🔧 Repair Shop • 🧹 Cleaning • 🎂 Bakery • 💅 Nail Studio • 🐾 Pet Clinic • ✈️ Travel Agency • 🎮 Gaming Zone • ".repeat(3);';
    }
    return line;
});
fs.writeFileSync(path, fixedLines.join('\n'));
