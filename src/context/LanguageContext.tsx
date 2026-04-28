import React, { createContext, useContext, useState, useEffect } from 'react';

const translations: Record<string, Record<string, string>> = {
  en: {
    // NAVBAR
    nav_features: "Features",
    nav_how_it_works: "How It Works",
    nav_pricing: "Pricing",
    nav_for_job_seekers: "For Job Seekers",
    nav_login: "Login",
    nav_signup: "Sign Up",
    nav_business_owner: "I'm a Business Owner",
    nav_job_seeker: "I'm Looking for a Job",
    
    // HERO
    hero_headline_1: "Stop Hiring the",
    hero_headline_2: "Wrong People.",
    hero_sub: "HireIQ AI conducts voice interviews in Hindi or English, reads body language live, checks certificates, and tells you exactly who to hire — in under 10 minutes.",
    hero_cta_primary: "Get Started Free →",
    hero_cta_secondary: "Watch Demo ▶",
    hero_trust_1: "✅ No credit card required",
    hero_trust_2: "✅ Works on any phone or laptop",
    hero_trust_3: "✅ Hindi + English support",
    
    // HOW IT WORKS
    how_header: "How HireIQ AI Works",
    step1_title: "Tell us your business",
    step1_desc: "Select business type, location, team size and budget. Takes 2 minutes.",
    step2_title: "AI builds your Team Blueprint",
    step2_desc: "AI tells you exactly what roles you need, how many, and what to pay.",
    step3_title: "Post a job in 1 click",
    step3_desc: "AI-generated job description ready instantly. Share link or print QR code.",
    step4_title: "AI interviews every candidate",
    step4_desc: "AI speaks in Hindi, asks smart questions, reads body language, checks documents.",
    step5_title: "Hire the best. In minutes.",
    step5_desc: "Get a scorecard with hire/don't hire recommendation. All candidates ranked.",
    
    // DASHBOARD
    dash_welcome: "Good Morning",
    dash_active_roles: "Active Roles",
    dash_candidates: "Candidates This Week",
    dash_interviews: "Interviews Completed",
    dash_top_candidate: "Top Candidate",
    dash_blueprint: "Team Blueprint Status",
    dash_recent: "Recent Activity",
    dash_view_all: "View All",
    dash_manage: "Manage",
    dash_view_results: "View Results",
    dash_view_profile: "View Profile",
    dash_view_blueprint: "View Blueprint",
    
    // BLUEPRINT
    blueprint_title: "Your AI Team Blueprint",
    blueprint_download: "Download Blueprint",
    blueprint_regenerate: "Regenerate Blueprint",
    blueprint_post_job: "Post Job Now",
    blueprint_view: "View Details",
    hire_first: "HIRE FIRST",
    hire_soon: "HIRE SOON",
    hire_later: "HIRE LATER",
    
    // INTERVIEW
    interview_loading_1: "Loading your interview details...",
    interview_loading_2: "Preparing your AI interviewer...",
    interview_loading_3: "Ready! Starting in 3 seconds...",
    interview_permission_title: "Let's Set Up Your Interview",
    interview_allow_mic: "Allow Microphone Access",
    interview_allow_cam: "Allow Camera Access",
    interview_consent: "I allow HireIQ AI to use my microphone and camera for this interview session only. Nothing is recorded or stored.",
    interview_start: "I'm Ready — Start Interview →",
    interview_ai_speaking: "AI is speaking...",
    interview_listening: "Listening to you...",
    interview_thinking: "AI is thinking...",
    interview_repeat: "Repeat Question",
    interview_done: "I'm Done Answering",
    interview_skip: "Skip Question",
    
    // SETTINGS
    settings_title: "Settings",
    settings_business: "Business Profile",
    settings_interview: "Interview Settings",
    settings_notifications: "Notifications",
    settings_subscription: "Subscription",
    
    // COMMON
    coming_soon: "Coming Soon",
    save: "Save",
    cancel: "Cancel",
    back: "Back",
    next: "Next",
    submit: "Submit",
    loading: "Loading...",
    error_generic: "Something went wrong. Please try again.",
    success: "Success!",
  },
  
  hi: {
    // NAVBAR
    nav_features: "विशेषताएं",
    nav_how_it_works: "यह कैसे काम करता है",
    nav_pricing: "कीमत",
    nav_for_job_seekers: "नौकरी खोजने वालों के लिए",
    nav_login: "लॉग इन",
    nav_signup: "साइन अप",
    nav_business_owner: "मैं एक व्यापारी हूं",
    nav_job_seeker: "मुझे नौकरी चाहिए",
    
    // HERO
    hero_headline_1: "गलत लोगों को",
    hero_headline_2: "हायर करना बंद करें।",
    hero_sub: "HireIQ AI हिंदी या English में voice interview लेता है, body language पढ़ता है, certificates check करता है, और बताता है किसे रखें — सिर्फ 10 मिनट में।",
    hero_cta_primary: "मुफ़्त शुरू करें →",
    hero_cta_secondary: "डेमो देखें ▶",
    hero_trust_1: "✅ क्रेडिट कार्ड की ज़रूरत नहीं",
    hero_trust_2: "✅ किसी भी फ़ोन या लैपटॉप पर काम करता है",
    hero_trust_3: "✅ हिंदी + English सपोर्ट",
    
    // HOW IT WORKS
    how_header: "HireIQ AI कैसे काम करता है",
    step1_title: "अपना बिज़नेस बताएं",
    step1_desc: "बिज़नेस टाइप, लोकेशन, टीम साइज़ और बजट चुनें। सिर्फ 2 मिनट लगते हैं।",
    step2_title: "AI आपकी टीम का ब्लूप्रिंट बनाता है",
    step2_desc: "AI आपको बताता है कि कौन से roles चाहिए, कितने लोग, और क्या salary दें।",
    step3_title: "1 क्लिक में job post करें",
    step3_desc: "AI-generated job description तुरंत तैयार। link share करें या QR code print करें।",
    step4_title: "AI हर candidate का interview लेता है",
    step4_desc: "AI हिंदी में बात करता है, smart questions पूछता है, body language पढ़ता है।",
    step5_title: "मिनटों में best को hire करें।",
    step5_desc: "Hire/Don't Hire recommendation के साथ scorecard मिलता है। सभी candidates ranked।",
    
    // DASHBOARD
    dash_welcome: "नमस्ते",
    dash_active_roles: "सक्रिय भूमिकाएं",
    dash_candidates: "इस सप्ताह candidates",
    dash_interviews: "Interview पूरे हुए",
    dash_top_candidate: "Top Candidate",
    dash_blueprint: "Team Blueprint Status",
    dash_recent: "हाल की गतिविधि",
    dash_view_all: "सभी देखें",
    dash_manage: "प्रबंधित करें",
    dash_view_results: "परिणाम देखें",
    dash_view_profile: "प्रोफ़ाइल देखें",
    dash_view_blueprint: "Blueprint देखें",
    
    // BLUEPRINT
    blueprint_title: "आपका AI Team Blueprint",
    blueprint_download: "Blueprint डाउनलोड करें",
    blueprint_regenerate: "Blueprint फिर बनाएं",
    blueprint_post_job: "Job Post करें",
    blueprint_view: "विवरण देखें",
    hire_first: "पहले HIRE करें",
    hire_soon: "जल्दी HIRE करें",
    hire_later: "बाद में HIRE करें",
    
    // INTERVIEW
    interview_loading_1: "Interview details load हो रहे हैं...",
    interview_loading_2: "AI interviewer तैयार हो रहा है...",
    interview_loading_3: "तैयार! 3 सेकंड में शुरू...",
    interview_permission_title: "Interview Setup करें",
    interview_allow_mic: "Microphone Access दें",
    interview_allow_cam: "Camera Access दें",
    interview_consent: "मैं HireIQ AI को सिर्फ इस interview के लिए microphone और camera इस्तेमाल करने की अनुमति देता/देती हूं। कुछ भी record या store नहीं होगा।",
    interview_start: "मैं तैयार हूं — Interview शुरू करें →",
    interview_ai_speaking: "AI बोल रहा है...",
    interview_listening: "आपकी बात सुन रहा है...",
    interview_thinking: "AI सोच रहा है...",
    interview_repeat: "सवाल दोबारा सुनें",
    interview_done: "मेरा जवाब पूरा हुआ",
    interview_skip: "यह सवाल छोड़ें",
    
    // SETTINGS
    settings_title: "सेटिंग्स",
    settings_business: "Business Profile",
    settings_interview: "Interview Settings",
    settings_notifications: "सूचनाएं",
    settings_subscription: "Subscription",
    
    // COMMON
    coming_soon: "जल्द आ रहा है",
    save: "सेव करें",
    cancel: "रद्द करें",
    back: "वापस",
    next: "आगे",
    submit: "जमा करें",
    loading: "लोड हो रहा है...",
    error_generic: "कुछ गलत हुआ। दोबारा कोशिश करें।",
    success: "सफल!",
  }
};

export const LanguageContext = createContext<any>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('hireguru_lang') || 'en';
  });
  
  const t = (key: string) => translations[lang]?.[key] || translations['en']?.[key] || key;
  
  const toggleLang = () => {
    const newLang = lang === 'en' ? 'hi' : 'en';
    setLang(newLang);
    localStorage.setItem('hireguru_lang', newLang);
  };

  const setLanguage = (newLang: string) => {
    setLang(newLang);
    localStorage.setItem('hireguru_lang', newLang);
  }
  
  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);