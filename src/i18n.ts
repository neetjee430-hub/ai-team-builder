import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "hello": "Hello",
      "get_started": "Get Started Free",
      "watch_demo": "Watch Demo"
    }
  },
  hi: {
    translation: {
      "hello": "नमस्ते",
      "get_started": "मुफ़्त में शुरू करें",
      "watch_demo": "डेमो देखें"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
