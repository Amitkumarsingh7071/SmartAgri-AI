import React, { useState } from 'react';
import CropRecommendForm from '../components/AI/CropRecommendForm';
import DiseaseDetectUpload from '../components/AI/DiseaseDetectUpload';
import ChatBot from '../components/AI/ChatBot';
import { useLanguage } from '../contexts/LanguageContext';
import { Cpu, Sprout, Leaf, MessageCircle, HelpCircle, AlertCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';

const AIStudio = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('crop');

  // Fertilizer Recommendation Form State
  const [fertCrop, setFertCrop] = useState('Wheat');
  const [fertN, setFertN] = useState('');
  const [fertP, setFertP] = useState('');
  const [fertK, setFertK] = useState('');
  const [fertPh, setFertPh] = useState('');
  const [fertMoisture, setFertMoisture] = useState('');
  
  const [fertLoading, setFertLoading] = useState(false);
  const [fertResult, setFertResult] = useState(null);
  const [fertError, setFertError] = useState('');

  const handleFertilizerSubmit = async (e) => {
    e.preventDefault();
    setFertError('');
    setFertResult(null);

    if (!fertN || !fertP || !fertK || !fertPh || !fertMoisture) {
      setFertError('Please fill in all soil values.');
      return;
    }

    try {
      setFertLoading(true);
      // Call direct Python FastAPI URL to avoid proxy issues
      const res = await axios.post('http://localhost:8000/api/recommend-fertilizer', {
        crop_name: fertCrop,
        N: Number(fertN),
        P: Number(fertP),
        K: Number(fertK),
        pH: Number(fertPh),
        moisture: Number(fertMoisture)
      });
      setFertResult(res.data);
    } catch (err) {
      console.error(err);
      setFertError('AI service connection failed. Check if Python microservice is running.');
    } finally {
      setFertLoading(false);
    }
  };

  const tabs = [
    { id: 'crop', label: t('ai.tabCrop'), icon: Sprout },
    { id: 'fertilizer', label: t('ai.tabFertilizer'), icon: Cpu },
    { id: 'disease', label: t('ai.tabDisease'), icon: Leaf },
    { id: 'chatbot', label: t('ai.tabChat'), icon: MessageCircle }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-left">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold flex items-center gap-2">
          <Cpu className="h-5.5 w-5.5 text-green-500" />
          {t('ai.title')}
        </h2>
        <p className="text-xs text-gray-500">{t('ai.subtitle')}</p>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-gray-200/50 dark:border-gray-800/30 overflow-x-auto gap-2">
        {tabs.map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-green-500 text-green-700 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tabs Content */}
      <div className="pt-4">
        {activeTab === 'crop' && <CropRecommendForm />}
        
        {activeTab === 'disease' && <DiseaseDetectUpload />}
        
        {activeTab === 'chatbot' && <ChatBot />}

        {activeTab === 'fertilizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Form (7 cols) */}
            <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/30">
              <h3 className="font-extrabold text-lg mb-1 flex items-center gap-2">
                <Cpu className="h-5 w-5 text-green-500" />
                AI Fertilizer Prescription
              </h3>
              <p className="text-xs text-gray-500 mb-6">Select your crop and provide NPK soil parameters to generate precise chemical dosage applications.</p>

              <form onSubmit={handleFertilizerSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Crop Name</label>
                  <select
                    value={fertCrop}
                    onChange={(e) => setFertCrop(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Wheat">Wheat</option>
                    <option value="Rice">Rice</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Maize">Maize</option>
                    <option value="Legumes">Legumes</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Nitrogen (N) ppm</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 70"
                      value={fertN}
                      onChange={(e) => setFertN(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Phosphorus (P) ppm</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 35"
                      value={fertP}
                      onChange={(e) => setFertP(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Potassium (K) ppm</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 120"
                      value={fertK}
                      onChange={(e) => setFertK(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Soil pH</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="e.g. 6.8"
                      value={fertPh}
                      onChange={(e) => setFertPh(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Moisture Percentage (%)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 45"
                      value={fertMoisture}
                      onChange={(e) => setFertMoisture(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {fertError && (
                  <div className="flex items-center gap-2 text-xs bg-red-50 dark:bg-red-950/20 text-red-500 p-3 rounded-xl">
                    <AlertCircle className="h-4.5 w-4.5" />
                    <span>{fertError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={fertLoading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all"
                >
                  <span>{fertLoading ? 'Generating chemical dosages...' : 'Get AI Fertilizer Advisory'}</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </button>
              </form>
            </div>

            {/* Results Display (5 cols) */}
            <div className="lg:col-span-5 h-full">
              {fertResult ? (
                <div className="glass-panel p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/30 text-left space-y-4 glow-green animate-in zoom-in-95 duration-200">
                  <div className="border-b border-gray-100 dark:border-gray-800/50 pb-3">
                    <span className="text-[9px] font-extrabold uppercase text-green-600 dark:text-green-400 block tracking-wider">Prescribed Treatment</span>
                    <h4 className="font-extrabold text-base text-gray-900 dark:text-white mt-1">{fertResult.recommended_fertilizer}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50/50 dark:bg-gray-800/10 rounded-xl border border-gray-100 dark:border-gray-850/45">
                      <span className="text-gray-450 uppercase text-[9px] font-bold block">Application Dosage</span>
                      <span className="text-xs font-extrabold text-gray-950 dark:text-white mt-0.5 block">{fertResult.quantity_kg_acre}</span>
                    </div>

                    <div className="p-3 bg-gray-50/50 dark:bg-gray-800/10 rounded-xl border border-gray-100 dark:border-gray-850/45">
                      <span className="text-gray-450 uppercase text-[9px] font-bold block">Method</span>
                      <span className="text-xs font-extrabold text-gray-950 dark:text-white mt-0.5 block truncate" title={fertResult.application_method}>
                        {fertResult.application_method.split(' ')[0]}...
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-450 uppercase text-[9px] font-bold block mb-1">Detailed Method Details</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold italic leading-relaxed">
                      {fertResult.application_method}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-450 uppercase text-[9px] font-bold block">Agronomist Explanation</span>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mt-1">
                      {fertResult.reasoning}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="glass-panel p-12 rounded-3xl border border-gray-200/50 dark:border-gray-800/30 flex flex-col justify-center items-center text-center h-full min-h-[300px]">
                  <HelpCircle className="h-12 w-12 text-gray-300 animate-bounce" />
                  <h4 className="font-bold text-sm text-gray-400 mt-4">Awaiting Soil Matrix</h4>
                  <p className="text-[11px] text-gray-500 mt-1 max-w-[200px]">Fill in the soil measurements on the left side to compile AI chemical solutions.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIStudio;
