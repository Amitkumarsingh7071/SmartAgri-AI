import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Brand & App
    appName: "SmartAgri AI",
    tagline: "Agronomy AI Decision Studio & Farmer Portal",

    // Navigation & Menu
    nav: {
      myProfile: "My Profile Badge",
      adminPanel: "Admin Panel",
      logout: "Log Out",
      signIn: "Sign In",
      notifications: "Notifications",
      unread: "Unread",
      noNotifications: "No notifications yet.",
      weather: "My Farm Weather"
    },
    menu: {
      dashboard: "Dashboard",
      farms: "My Farms",
      crops: "Crop Stages",
      soilHealth: "Soil Health",
      finance: "Finance Tracker",
      schemes: "Govt Schemes",
      aiStudio: "AI Studio",
      profile: "Profile",
      admin: "Admin Panel"
    },

    // AI Studio Tabs & Headings
    ai: {
      title: "Agronomy AI Decision Studio",
      subtitle: "Access artificial intelligence machine learning models for soil recommendations and disease analysis.",
      tabCrop: "Crop Suitability",
      tabFertilizer: "Fertilizer Advisor",
      tabDisease: "Disease Diagnostics",
      tabChat: "Krishi AI Chat",
      
      // Crop Form
      cropTitle: "AI Crop Recommendation",
      cropSubtitle: "Input your soil chemical parameters and weather telemetry to predict optimal crop yields.",
      nitrogen: "Nitrogen (N) ppm",
      phosphorus: "Phosphorus (P) ppm",
      potassium: "Potassium (K) ppm",
      ph: "Soil pH Level",
      temp: "Avg Temp (°C)",
      humidity: "Humidity (%)",
      rainfall: "Rainfall (mm)",
      getRecommendation: "Get AI Recommendation",
      analyzing: "Analyzing Soil Chemistry...",
      recommendedCrop: "Recommended Optimal Crop",
      suitabilityScore: "Suitability Score",
      agronomistAdvice: "Agronomist Advice",
      awaitingSoilMatrix: "Awaiting Soil Matrix Data",
      fillParameters: "Fill in the soil parameters to compile AI crop suitability.",

      // Fertilizer Form
      fertTitle: "AI Fertilizer Prescription",
      fertSubtitle: "Select your crop and provide NPK soil parameters to generate precise chemical dosage applications.",
      cropName: "Crop Name",
      moisture: "Moisture Percentage (%)",
      getFertilizer: "Get AI Fertilizer Advisory",
      prescribedTreatment: "Prescribed Treatment",
      dosage: "Application Dosage",
      method: "Method",
      details: "Detailed Method Details",
      awaitingFert: "Fill in soil measurements on the left side to compile AI chemical solutions.",

      // Chatbot
      chatTitle: "Krishi AI Farming Assistant",
      chatSubtitle: "Ask any farming question about pest control, weather advisories, soil deficits, or Mandi market pricing.",
      askPlaceholder: "Ask Krishi AI about crops, disease treatments, or Mandi prices...",
      send: "Send",
      botIntro: "Hello! I am your Smart Agri AI Assistant. Ask me anything about crop suitability, leaf disease treatments, NPK soil deficits, or market pricing strategies!"
    },

    // Disease Diagnostics
    disease: {
      title: "Multi-Crop Leaf Diagnostics",
      subtitle: "Upload a clear photo of an infected crop leaf (Tomato, Potato, Corn, Apple, Grape, Pepper, Strawberry, Orange, Peach, Cherry, Blueberry, etc.) to analyze pathogen symptoms and view ML treatments.",
      dragClick: "Click or Drag Leaf Image",
      supportedCrops: "Supports 14+ Crops & 38 Disease Profiles",
      runDiagnostics: "Run Diagnostics",
      analyzingLeaf: "Analyzing leaf symptoms...",
      resultHeading: "Diagnosis Result",
      confidence: "Confidence",
      causes: "Root Causes",
      organicTreatment: "Organic Treatment",
      chemicalTreatment: "Chemical Treatment",
      preventiveMeasures: "Preventive Measures",
      awaitingPhoto: "Awaiting Diagnostics Photo",
      awaitingSubtext: "Upload a photo of crop foliage leaf spots to generate ML diagnostic treatments and advice."
    },

    // Dashboard Quick Actions & Cards
    dashboard: {
      welcome: "Welcome Back",
      overview: "Agricultural Operations Overview",
      activeFarms: "Active Farms",
      registeredCrops: "Registered Crops",
      soilHealthScore: "Soil Health Index",
      monthlyExpense: "Monthly Cashflow",
      quickActions: "Quick Actions",
      diagnoseDisease: "Diagnose Leaf Disease",
      soilCard: "Generate Soil Health Card",
      viewMandi: "Check Mandi Market Prices",
      schemeMatch: "Match Govt Schemes"
    }
  },

  hi: {
    // Brand & App
    appName: "स्मार्ट एग्री AI",
    tagline: "कृषि AI निर्णय स्टूडियो और किसान पोर्टल",

    // Navigation & Menu
    nav: {
      myProfile: "मेरी प्रोफाइल",
      adminPanel: "एडमिन पैनल",
      logout: "लॉग आउट",
      signIn: "साइन इन",
      notifications: "सूचनाएं",
      unread: "अपठित",
      noNotifications: "कोई नई सूचना नहीं है।",
      weather: "खेत का मौसम"
    },
    menu: {
      dashboard: "डैशबोर्ड",
      farms: "मेरे खेत",
      crops: "फसल चरण",
      soilHealth: "मृदा स्वास्थ्य",
      finance: "वित्तीय ट्रैकर",
      schemes: "सरकारी योजनाएं",
      aiStudio: "AI स्टूडियो",
      profile: "प्रोफाइल",
      admin: "एडमिन पैनल"
    },

    // AI Studio Tabs & Headings
    ai: {
      title: "कृषि AI निर्णय स्टूडियो",
      subtitle: "मृदा सिफारिशों और बीमारी विश्लेषण के लिए आर्टिफिशियल इंटेलिजेंस मॉडल का उपयोग करें।",
      tabCrop: "फसल उपयुक्तता",
      tabFertilizer: "उर्वरक सलाहकार",
      tabDisease: "बीमारी पहचान (रोग निदान)",
      tabChat: "कृषि AI चैट",
      
      // Crop Form
      cropTitle: "AI फसल सिफारिश",
      cropSubtitle: "सर्वोत्तम फसल उपज का अनुमान लगाने के लिए मिट्टी के रासायनिक मान दर्ज करें।",
      nitrogen: "नाइट्रोजन (N) ppm",
      phosphorus: "फास्फोरस (P) ppm",
      potassium: "पोटेशियम (K) ppm",
      ph: "मिट्टी का pH स्तर",
      temp: "औसत तापमान (°C)",
      humidity: "आर्द्रता (%)",
      rainfall: "वर्षा (मिमी)",
      getRecommendation: "AI फसल सिफारिश प्राप्त करें",
      analyzing: "मिट्टी की जांच की जा रही है...",
      recommendedCrop: "अनुशंसित सर्वोत्तम फसल",
      suitabilityScore: "उपयुक्तता स्कोर",
      agronomistAdvice: "कृषि विशेषज्ञ की सलाह",
      awaitingSoilMatrix: "मिट्टी के आंकड़ों की प्रतीक्षा है",
      fillParameters: "फसल उपयुक्तता जानने के लिए मिट्टी के मान भरें।",

      // Fertilizer Form
      fertTitle: "AI उर्वरक नुस्खा (प्रिस्क्रिप्शन)",
      fertSubtitle: "अपनी फसल चुनें और सटीक रासायनिक खुराक प्राप्त करने के लिए NPK मान दर्ज करें।",
      cropName: "फसल का नाम",
      moisture: "नमी प्रतिशत (%)",
      getFertilizer: "AI उर्वरक सलाह प्राप्त करें",
      prescribedTreatment: "अनुशंसित उपचार",
      dosage: "प्रयोग की मात्रा (खुराक)",
      method: "प्रयोग का तरीका",
      details: "विस्तृत विवरण",
      awaitingFert: "रासायनिक समाधान प्राप्त करने के लिए बाईं ओर मिट्टी के मान भरें।",

      // Chatbot
      chatTitle: "कृषि AI सहायक",
      chatSubtitle: "कीट नियंत्रण, मौसम सलाह, मिट्टी की कमी, या मंडी भाव के बारे में कोई भी प्रश्न पूछें।",
      askPlaceholder: "कृषि AI से फसलों, बीमारियों के उपचार या मंडी भाव के बारे में पूछें...",
      send: "भेजें",
      botIntro: "नमस्ते! मैं आपका स्मार्ट एग्री AI सहायक हूँ। फसल उपयुक्तता, पत्ती की बीमारी के उपचार, NPK कमी या मंडी मूल्य रणनीतियों के बारे में मुझसे कुछ भी पूछें!"
    },

    // Disease Diagnostics
    disease: {
      title: "बहु-फसल पत्ती रोग निदान",
      subtitle: "रोग के लक्षणों का विश्लेषण करने और उपचार देखने के लिए संक्रमित पत्ती (टमाटर, आलू, मक्का, सेब, अंगूर, मिर्च, स्ट्रॉबेरी, संतरा, आडू, चेरी, आदि) की स्पष्ट तस्वीर अपलोड करें।",
      dragClick: "पत्ती की तस्वीर पर क्लिक करें या खींचकर लाएं",
      supportedCrops: "14+ फसलें और 38 बीमारी प्रोफाइल समर्थित",
      runDiagnostics: "रोग की जांच करें (निदान शुरू करें)",
      analyzingLeaf: "पत्ती के लक्षणों का विश्लेषण हो रहा है...",
      resultHeading: "जांच का परिणाम (निदान)",
      confidence: "सटीकता (विश्वास प्रतिशत)",
      causes: "मुख्य कारण",
      organicTreatment: "जैविक उपचार (जैविक दवा)",
      chemicalTreatment: "रासायनिक उपचार (रसायन दवा)",
      preventiveMeasures: "बचाव के उपाय",
      awaitingPhoto: "रोग की तस्वीर की प्रतीक्षा है",
      awaitingSubtext: "AI उपचार और सलाह प्राप्त करने के लिए रोगग्रस्त पत्ती की फोटो अपलोड करें।"
    },

    // Dashboard Quick Actions & Cards
    dashboard: {
      welcome: "पुनः स्वागत है",
      overview: "कृषि गतिविधियों का विवरण",
      activeFarms: "सक्रिय खेत",
      registeredCrops: "पंजीकृत फसलें",
      soilHealthScore: "मृदा स्वास्थ्य सूचकांक",
      monthlyExpense: "मासिक आय-व्यय",
      quickActions: "त्वरित कार्य",
      diagnoseDisease: "पत्ती की बीमारी जांचें",
      soilCard: "मृदा कार्ड बनाएं",
      viewMandi: "मंडी के ताजा भाव देखें",
      schemeMatch: "सरकारी योजनाएं देखें"
    }
  },

  mr: {
    // Brand & App
    appName: "स्मार्ट ॲग्री AI",
    tagline: "शेती AI निर्णय केंद्र व शेतकरी पोर्टल",

    // Navigation & Menu
    nav: {
      myProfile: "माझे प्रोफाइल",
      adminPanel: "ॲडमिन पॅनेल",
      logout: "लॉग आऊट",
      signIn: "साइन इन",
      notifications: "सूचना",
      unread: "न वाचलेले",
      noNotifications: "कोणतीही नवीन सूचना नाही.",
      weather: "शेतातील हवामान"
    },
    menu: {
      dashboard: "डॅशबोर्ड",
      farms: "माझी शेती (शेत)",
      crops: "पिकांचे टप्पे",
      soilHealth: "मातीचे आरोग्य (मृदा)",
      finance: "आर्थिक हिशोब",
      schemes: "शासकीय योजना",
      aiStudio: "AI स्टुडिओ",
      profile: "प्रोफाइल",
      admin: "ॲडमिन पॅनेल"
    },

    // AI Studio Tabs & Headings
    ai: {
      title: "कृषी AI निर्णय केंद्र",
      subtitle: "मातीची शिफारस आणि रोगांच्या विश्लेषणासाठी कृत्रिम बुद्धिमत्ता (AI) मॉडेलचा वापर करा.",
      tabCrop: "पिकांची सुयोग्य निवड",
      tabFertilizer: "खत सल्लागार",
      tabDisease: "रोग निदान (पिक आजार)",
      tabChat: "कृषी AI गप्पा (चॅट)",
      
      // Crop Form
      cropTitle: "AI पिक शिफारस",
      cropSubtitle: "उत्तम उत्पादनासाठी तुमच्या शेतातील मातीचे रासायनिक प्रमाण प्रविष्ट करा.",
      nitrogen: "नत्र (N) ppm",
      phosphorus: "स्फुरद (P) ppm",
      potassium: "पालाश (K) ppm",
      ph: "मातीचा सामू (pH)",
      temp: "सरासरी तापमान (°C)",
      humidity: "हवेतील आद्रता (%)",
      rainfall: "पाऊस (मिमी)",
      getRecommendation: "AI पिक शिफारस मिळवा",
      analyzing: "मातीचे विश्लेषण सुरू आहे...",
      recommendedCrop: "शिफारस केलेले उत्तम पिक",
      suitabilityScore: "योग्यतेचा गुणक्रम",
      agronomistAdvice: "कृषी तज्ज्ञांचा सल्ला",
      awaitingSoilMatrix: "मातीच्या नोंदीची प्रतीक्षा आहे",
      fillParameters: "पिकांची सुयोग्यता पाहण्यासाठी डाव्या बाजूला मातीचे घटक भरा.",

      // Fertilizer Form
      fertTitle: "AI खत मात्रा सल्ला",
      fertSubtitle: "योग्य खताचे प्रमाण मिळवण्यासाठी तुमचे पिक निवडा व NPK मूल्ये भरा.",
      cropName: "पिकाचे नाव",
      moisture: "ओलावा प्रमाण (%)",
      getFertilizer: "AI खत सल्ला मिळवा",
      prescribedTreatment: "शिफारस केलेले खत",
      dosage: "खताची मात्रा (प्रमाण)",
      method: "खत देण्याची पद्धत",
      details: "सविस्तर माहिती",
      awaitingFert: "खताचा सल्ला मिळवण्यासाठी डाव्या बाजूला मातीचे घटक भरा.",

      // Chatbot
      chatTitle: "कृषी AI मदतनीस",
      chatSubtitle: "कीड नियंत्रण, हवामान अंदाज, मातीतील कमतरता किंवा बाजार भावाबाबत प्रश्न विचारा.",
      askPlaceholder: "पिके, रोगांवरील उपाय किंवा बाजारभावाबाबत विचारा...",
      send: "पाठवा",
      botIntro: "नमस्कार! मी तुमचा स्मार्ट ॲग्री AI मदतनीस आहे. पिक निवड, पानांवरील रोग, NPK कमतरता किंवा बाजारभाव याबद्दल काहीही विचारा!"
    },

    // Disease Diagnostics
    disease: {
      title: "बहु-पिक पान रोग निदान",
      subtitle: "रोगांचे निदान आणि उपाय पाहण्यासाठी बाधित पानाचा (टोमॅटो, बटाटा, मका, सफरचंद, द्राक्षे, मिरची, स्ट्रॉबेरी, संत्री, इत्यादी) स्पष्ट फोटो अपलोड करा.",
      dragClick: "पानाचा फोटो अपलोड करा किंवा येथे टाका",
      supportedCrops: "१४+ पिके आणि ३८ रोग प्रकार समर्थित",
      runDiagnostics: "रोग निदान करा",
      analyzingLeaf: "पानावरील लक्षणांचे विश्लेषण होत आहे...",
      resultHeading: "निदान निकाल",
      confidence: "अचूकता (टक्केवारी)",
      causes: "रोगाची मुख्य कारणे",
      organicTreatment: "सेंद्रिय उपाय (जैविक)",
      chemicalTreatment: "रासायनिक उपाय (औषध)",
      preventiveMeasures: "प्रतिबंधात्मक काळजी (प्रतिबंध)",
      awaitingPhoto: "पानाच्या फोटोची प्रतीक्षा आहे",
      awaitingSubtext: "उपाय आणि सल्ला मिळवण्यासाठी बाधित पाण्याचा स्पष्ट फोटो अपलोड करा."
    },

    // Dashboard Quick Actions & Cards
    dashboard: {
      welcome: "पुन्हा स्वागत आहे",
      overview: "शेती व्यवस्थापन सारांश",
      activeFarms: "सक्रिय शेतजमीन",
      registeredCrops: "नोंदणीकृत पिके",
      soilHealthScore: "मृदा आरोग्य निर्देशांक",
      monthlyExpense: "मासिक आर्थिक जमा-खर्च",
      quickActions: "जलद कृती",
      diagnoseDisease: "पानावरील रोग तपासा",
      soilCard: "मृदा आरोग्य पत्रक तयार करा",
      viewMandi: "बाजारभाव पहा",
      schemeMatch: "शासकीय योजना शोधा"
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  };

  // Helper function to fetch nested keys like t('nav.myProfile')
  const t = (path) => {
    const keys = path.split('.');
    let current = translations[language] || translations.en;
    
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English if translation is missing
        let fallback = translations.en;
        for (const k of keys) {
          if (fallback && fallback[k] !== undefined) {
            fallback = fallback[k];
          } else {
            return path;
          }
        }
        return fallback;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
