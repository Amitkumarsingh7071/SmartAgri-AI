const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const WeatherAlert = require('../models/WeatherAlert');
const http = require('http');

// Multilingual Agronomist System Prompts & Fallbacks
const systemKnowledge = {
  en: {
    irrigation: "Based on your active crop condition and weather forecast: Avoid overwatering if rainfall is predicted within 24 hours. Ensure morning drip irrigation for high temperatures.",
    fertilizer: "For optimal growth, apply balanced NPK fertilizers. If nitrogen levels are low, apply Neem Coated Urea in split doses. For flowering stages, increase Phosphorus and Potassium.",
    disease: "Inspect leaves for early spot symptoms. Prune lower affected leaves to increase airflow. Spray organic Neem Oil formulation (1500 ppm) or consult your local KVK officer for specific fungicide dosages.",
    general: "SmartAgri AI decision support: Monitor your soil telemetry, check daily mandi prices, and follow our actionable weather alerts."
  },
  hi: {
    irrigation: "आपकी फसल और मौसम के अनुसार: यदि अगले 24 घंटों में बारिश की संभावना है तो सिंचाई से बचें। उच्च तापमान में सुबह के समय ड्रिप सिंचाई करें।",
    fertilizer: "सर्वोत्तम वृद्धि के लिए संतुलित NPK उर्वरक डालें। नाइट्रोजन की कमी होने पर नीम लेपित यूरिया का उपयोग करें। फूल आने की अवस्था में फास्फोरस और पोटाश बढ़ाएं।",
    disease: "पत्तियों पर धब्बों की नियमित जांच करें। हवा का प्रवाह बढ़ाने के लिए प्रभावित निचली पत्तियों को काटें। नीम तेल (1500 ppm) का छिड़काव करें या स्थानीय कृषि अधिकारी से सलाह लें।",
    general: "स्मार्टएग्री एआई सेवा: अपनी मिट्टी के नमूनों की जांच करें, दैनिक मंडी भाव देखें और मौसम अलर्ट का पालन करें।"
  },
  mr: {
    irrigation: "तुमच्या पिकाच्या आणि हवामानाच्या अंदाजानुसार: पुढील २४ तासांत पावसाची शक्यता असल्यास ओलित/पाणी देणे टाळा. जास्त तापमानात सकाळी ठिबक सिंचन करा.",
    fertilizer: "पिकाच्या चांगल्या वाढीसाठी संतुलित NPK खते द्या. नत्राची कमतरता असल्यास कडुनिंब लेपित युरिया टप्प्याटप्प्याने द्या. फुलधारणेच्या काळात स्फुरद आणि पालाश वाढवा.",
    disease: "पानावरील डागांचे निरीक्षण करा. हवा खेळती राहण्यासाठी बाधित खालची पाने काढून टाका. कडुनिंब तेलाची (१५०० ppm) फवारणी करा किंवा स्थानिक कृषी अधिकाऱ्यांचा सल्ला घ्या.",
    general: "स्मार्टॲग्री एआय कृषी सल्लागार: जमिनीची सुपीकता तपासा, दररोजचे बाजारभाव पहा आणि हवामान इशार्‍यांचे पालन करा."
  }
};

// @desc    Process Context-Aware Voice Query
// @route   POST /api/voice/query
// @access  Private
const processVoiceQuery = async (req, res) => {
  try {
    const { speechText, lang = 'en', farmId } = req.body;

    if (!speechText || !speechText.trim()) {
      return res.status(400).json({ success: false, message: 'Speech query cannot be empty.' });
    }

    const userId = req.user._id;

    // Retrieve active farmer context (Crops, Farms, Weather Alerts)
    const userFarms = await Farm.find({ userId });
    const userCrops = await Crop.find({ userId, stage: { $ne: 'Harvested' } });
    const activeAlerts = await WeatherAlert.find({ userId }).sort({ createdAt: -1 }).limit(2);

    const activeFarm = farmId ? userFarms.find(f => f._id.toString() === farmId) : userFarms[0];
    const activeCrop = userCrops.length > 0 ? userCrops[0] : null;

    const cropName = activeCrop ? activeCrop.name : (activeFarm?.currentCrop || 'Tomato');
    const cropStage = activeCrop ? activeCrop.stage : 'Vegetative';
    const plantedDate = activeCrop ? new Date(activeCrop.plantedDate) : new Date();
    const cropAgeDays = Math.max(1, Math.floor((Date.now() - plantedDate.getTime()) / (1000 * 60 * 60 * 24)));
    const farmArea = activeFarm ? activeFarm.area : (req.user.profile?.farmSize || 2);

    const textLower = speechText.toLowerCase();
    const targetLang = (lang === 'hi' || textLower.match(/[\u0900-\u097F]/)) ? 'hi' : (lang === 'mr' ? 'mr' : 'en');

    // Categorize Query Intent
    let intent = 'general';
    if (textLower.includes('irrigat') || textLower.includes('water') || textLower.includes('पाणी') || textLower.includes('सिंचाई') || textLower.includes('पिलाना')) {
      intent = 'irrigation';
    } else if (textLower.includes('fertiliz') || textLower.includes('khad') || textLower.includes('खत') || textLower.includes('खाद') || textLower.includes('npk') || textLower.includes('urea')) {
      intent = 'fertilizer';
    } else if (textLower.includes('disease') || textLower.includes('yellow') || textLower.includes('spot') || textLower.includes('कीड़ा') || textLower.includes('रोग') || textLower.includes('किड') || textLower.includes('पान')) {
      intent = 'disease';
    }

    // Compose Context-Aware Response
    let aiResponse = systemKnowledge[targetLang][intent];
    
    // Append Crop Context specifics
    if (targetLang === 'en') {
      aiResponse = `[Crop Context: ${cropName}, ${cropAgeDays} days old on ${farmArea} Acres plot]\n\n` + aiResponse;
      if (activeAlerts.length > 0 && intent === 'irrigation') {
        aiResponse += `\n\n⚠️ Note: ${activeAlerts[0].title} is currently active for your plot.`;
      }
    } else if (targetLang === 'hi') {
      aiResponse = `[आपकी फसल: ${cropName}, उम्र: ${cropAgeDays} दिन, क्षेत्र: ${farmArea} एकड़]\n\n` + aiResponse;
    } else if (targetLang === 'mr') {
      aiResponse = `[तुमचे पीक: ${cropName}, वय: ${cropAgeDays} दिवस, क्षेत्र: ${farmArea} एकर]\n\n` + aiResponse;
    }

    res.json({
      success: true,
      query: speechText,
      lang: targetLang,
      context: {
        cropName,
        cropAgeDays,
        cropStage,
        farmArea
      },
      response: aiResponse
    });
  } catch (error) {
    console.error('processVoiceQuery error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  processVoiceQuery
};
