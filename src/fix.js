const fs = require('fs');
const path = './src/pages/LandingPage.tsx';
let data = fs.readFileSync(path, 'utf8');
data = data.replace(/const businessItems = "[^;]+;\s*([^;]+;)?/, 'const businessItems = "💇 Salon • 🏋️ Gym • 📚 Coaching • 🍽️ Restaurant • 🏥 Clinic • 👗 Boutique • 🎓 School • ☕ Café • 🏠 Real Estate • 🚗 Driving School • 💊 Pharmacy • 📸 Studio • 🏨 Hotel • 🔧 Repair Shop • 🧹 Cleaning • 🎂 Bakery • 💅 Nail Studio • 🐾 Pet Clinic • ✈️ Travel Agency • 🎮 Gaming Zone • ".repeat(3);');
fs.writeFileSync(path, data);
