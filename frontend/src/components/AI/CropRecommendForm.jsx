import React, { useState, useEffect } from 'react';
import aiAPI from '../../services/api'; // connects to proxy or direct
import API from '../../services/api';
import { Cpu, AlertCircle, ArrowRight, Sprout, BarChart3, HelpCircle } from 'lucide-react';
import axios from 'axios';

const CropRecommendForm = () => {
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState('');
  
  // Inputs
  const [N, setN] = useState('');
  const [P, setP] = useState('');
  const [K, setK] = useState('');
  const [pH, setPh] = useState('');
  const [temp, setTemp] = useState('25');
  const [humidity, setHumidity] = useState('65');
  const [rainfall, setRainfall] = useState('100');

  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState('');

  // Load farms to support autofilling
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const res = await API.get('/farms');
        if (res.data.success) {
          setFarms(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchFarms();
  }, []);

  const handleAutofill = async (farmId) => {
    setSelectedFarm(farmId);
    if (!farmId) return;

    try {
      setLoading(true);
      // Fetch latest soil record for this farm
      const res = await API.get('/soil');
      if (res.data.success) {
        const farmRecord = res.data.data.find(r => r.farmId._id === farmId);
        if (farmRecord) {
          setN(farmRecord.N);
          setP(farmRecord.P);
          setK(farmRecord.K);
          setPh(farmRecord.pH);
          setError('');
        } else {
          setError('No soil logs found for this farm. Input manually.');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setRecommendation(null);

    if (!N || !P || !K || !pH || !temp || !humidity || !rainfall) {
      setError('Please provide all parameters.');
      return;
    }

    try {
      setLoading(true);
      
      // Call direct Python FastAPI URL to avoid server proxy issues
      const res = await axios.post('http://localhost:8000/api/recommend-crop', {
        N: Number(N),
        P: Number(P),
        K: Number(K),
        pH: Number(pH),
        temperature: Number(temp),
        humidity: Number(humidity),
        rainfall: Number(rainfall)
      });

      setRecommendation(res.data);
    } catch (err) {
      console.error(err);
      setError('Could not connect to AI service. Ensure python microservice is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Input Form (7 columns) */}
      <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/30 text-left">
        <h3 className="font-extrabold text-lg mb-1 flex items-center gap-2">
          <Cpu className="h-5 w-5 text-green-500" />
          AI Crop Suitability Recommender
        </h3>
        <p className="text-xs text-gray-500 mb-6">Type in or autofill metrics from farm sensor logs to predict the highest yielding crop.</p>

        {/* Farm Autofill Selector */}
        {farms.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-green-50/50 dark:bg-green-950/10 border border-green-100/50 dark:border-green-900/30">
            <label className="block text-[11px] font-bold text-green-700 dark:text-green-400 uppercase mb-2">Autofill from Registered Farm</label>
            <select
              value={selectedFarm}
              onChange={(e) => handleAutofill(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-green-200 dark:border-green-900 bg-white dark:bg-gray-900 focus:outline-none"
            >
              <option value="">-- Choose Farm to Autofill NPK --</option>
              {farms.map(f => (
                <option key={f._id} value={f._id}>{f.name} ({f.soilType})</option>
              ))}
            </select>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Nitrogen (N)</label>
              <input
                type="number"
                value={N}
                onChange={(e) => setN(e.target.value)}
                placeholder="e.g. 90"
                className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Phosphorus (P)</label>
              <input
                type="number"
                value={P}
                onChange={(e) => setP(e.target.value)}
                placeholder="e.g. 45"
                className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Potassium (K)</label>
              <input
                type="number"
                value={K}
                onChange={(e) => setK(e.target.value)}
                placeholder="e.g. 150"
                className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Soil pH</label>
              <input
                type="number"
                step="0.1"
                value={pH}
                onChange={(e) => setPh(e.target.value)}
                placeholder="e.g. 6.5"
                className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Avg Temperature (°C)</label>
              <input
                type="number"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                placeholder="e.g. 26"
                className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Relative Humidity (%)</label>
              <input
                type="number"
                value={humidity}
                onChange={(e) => setHumidity(e.target.value)}
                placeholder="e.g. 70"
                className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Annual Rainfall (mm)</label>
              <input
                type="number"
                value={rainfall}
                onChange={(e) => setRainfall(e.target.value)}
                placeholder="e.g. 120"
                className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs bg-red-50 dark:bg-red-950/20 text-red-500 p-3 rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all duration-200 mt-4"
          >
            <span>{loading ? 'Evaluating soil values...' : 'Get AI Recommendation'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Output Display (5 columns) */}
      <div className="lg:col-span-5 h-full">
        {recommendation ? (
          <div className="glass-panel p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/30 text-left glow-green animate-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/10 p-5 rounded-2xl border border-green-100/50 dark:border-green-900/30 mb-6 text-center">
              <div className="bg-green-500 p-3 rounded-full text-white inline-block mb-3 shadow-md">
                <Sprout className="h-6 w-6" />
              </div>
              <h4 className="text-[10px] text-green-700 dark:text-green-400 font-bold uppercase tracking-wider">Top recommended crop</h4>
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white block mt-1">{recommendation.recommended_crop}</span>
            </div>

            <div className="space-y-4">
              {/* Confidence */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-gray-400 uppercase tracking-wide text-[9px] font-bold">Confidence score</span>
                  <span className="text-green-600 dark:text-green-400 font-bold">{recommendation.confidence}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-1000"
                    style={{ width: `${recommendation.confidence}%` }}
                  ></div>
                </div>
              </div>

              {/* Yield */}
              <div className="p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/10 border border-gray-100 dark:border-gray-800">
                <span className="text-gray-400 uppercase tracking-wide text-[9px] font-bold block">Expected Yield</span>
                <span className="text-sm font-extrabold text-gray-800 dark:text-gray-200 flex items-center gap-1.5 mt-0.5">
                  <BarChart3 className="h-4 w-4 text-emerald-500" />
                  {recommendation.expected_yield}
                </span>
              </div>

              {/* Market outlook */}
              <div className="p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/10 border border-gray-100 dark:border-gray-800">
                <span className="text-gray-400 uppercase tracking-wide text-[9px] font-bold block">Market Outlook</span>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 block mt-1">
                  {recommendation.market_outlook}
                </span>
              </div>

              {/* Reasoning */}
              <div className="pt-2">
                <span className="text-gray-400 uppercase tracking-wide text-[9px] font-bold block">AI Decision Reasoning</span>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mt-1">
                  {recommendation.reason}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-12 rounded-3xl border border-gray-200/50 dark:border-gray-800/30 flex flex-col justify-center items-center text-center h-full min-h-[300px]">
            <HelpCircle className="h-12 w-12 text-gray-300 dark:text-gray-700 animate-bounce" />
            <h4 className="font-bold text-sm text-gray-400 mt-4">Awaiting Soil Telemetry</h4>
            <p className="text-[11px] text-gray-500 mt-1 max-w-[200px]">Provide NPK inputs on the left side to trigger AI predictions.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropRecommendForm;
