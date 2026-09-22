import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import WeatherAlertsWidget from '../components/Dashboard/WeatherAlertsWidget';
import SmartAgriVoice from '../components/Voice/SmartAgriVoice';
import MandiPricesWidget from '../components/Dashboard/MandiPricesWidget';
import PricePredictorWidget from '../components/Dashboard/PricePredictorWidget';
import InputPricesWidget from '../components/Dashboard/InputPricesWidget';
import NdviSatelliteAnalyzer from '../components/Maps/NdviSatelliteAnalyzer';
import InsuranceClaimAssistant from '../components/Insurance/InsuranceClaimAssistant';
import API from '../services/api';
import { Sprout, Map, Coins, ArrowUpRight, CheckSquare, AlertTriangle, ShieldCheck, Activity, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    farmCount: 0,
    cropCount: 0,
    totalArea: 0,
    savings: 0,
  });
  const [primaryFarm, setPrimaryFarm] = useState(null);
  const [dailyActions, setDailyActions] = useState([
    { id: 1, text: 'Check soil moisture before afternoon irrigation', completed: true },
    { id: 2, text: 'Inspect Tomato foliage for early yellow spot halos', completed: false },
    { id: 3, text: 'Check field drainage channels ahead of forecasted rain', completed: false },
    { id: 4, text: 'Verify latest mandi price index for cotton harvest', completed: false }
  ]);
  const [activeDiseaseReport, setActiveDiseaseReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [farmsRes, cropsRes, financeRes, diseaseRes] = await Promise.all([
          API.get('/farms'),
          API.get('/crops'),
          API.get('/finance/analytics'),
          API.get('/disease-workflow/reports')
        ]);

        const farmData = farmsRes.data.data || [];
        const cropData = cropsRes.data.data || [];
        const financeData = financeRes.data.data || { totalIncome: 0, totalExpense: 0 };
        const diseaseData = diseaseRes.data.data || [];

        const totalArea = farmData.reduce((sum, f) => sum + (f.area || 0), 0);
        const activeCrops = cropData.filter(c => c.stage !== 'Harvested').length;

        if (farmData.length > 0) {
          setPrimaryFarm(farmData[0]);
        }

        setStats({
          farmCount: farmData.length,
          cropCount: activeCrops,
          totalArea: totalArea.toFixed(1),
          savings: (financeData.totalIncome - financeData.totalExpense)
        });

        if (diseaseData.length > 0) {
          setActiveDiseaseReport(diseaseData[0]);
        }
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const toggleAction = (id) => {
    setDailyActions(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-left">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6 md:p-8 shadow-xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="relative z-10 max-w-2xl">
          <span className="text-[10px] uppercase font-extrabold tracking-wider bg-white/20 px-3 py-1 rounded-full border border-white/10">
            SmartAgri-AI Enterprise Platform
          </span>
          <h1 className="text-2xl md:text-3xl font-black mt-3">
            Good Morning, {user?.profile?.name || 'Farmer'} 👨‍🌾
          </h1>
          <p className="text-xs text-green-100/90 mt-2 leading-relaxed font-medium">
            Your comprehensive ag-tech decision center. Monitor satellite crop health, predict 30-day Mandi trends, track Krishi Kendra input prices, and auto-compile PMFBY insurance claims.
          </p>

          <div className="flex flex-wrap gap-2.5 mt-5">
            <Link
              to="/ai-studio"
              className="bg-white hover:bg-gray-100 text-green-700 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              Consult AI Studio
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              to="/profile"
              className="bg-green-700/50 hover:bg-green-700/70 border border-green-400/30 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
            >
              View Farmer QR ID
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Counters Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-gray-200/50 dark:border-gray-800/30 flex items-center gap-4">
          <div className="bg-green-100 dark:bg-green-950/40 p-3 rounded-xl text-green-600 dark:text-green-400">
            <Map className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Total Plot Area</span>
            <span className="text-lg font-extrabold text-gray-900 dark:text-white mt-0.5">
              {loading ? '...' : `${stats.totalArea} Acres`}
            </span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-200/50 dark:border-gray-800/30 flex items-center gap-4">
          <div className="bg-emerald-100 dark:bg-emerald-950/40 p-3 rounded-xl text-emerald-600 dark:text-emerald-400">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Active Crops</span>
            <span className="text-lg font-extrabold text-gray-900 dark:text-white mt-0.5">
              {loading ? '...' : `${stats.cropCount} Varieties`}
            </span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-200/50 dark:border-gray-800/30 flex items-center gap-4">
          <div className="bg-amber-100 dark:bg-amber-950/40 p-3 rounded-xl text-amber-600 dark:text-amber-400">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Net Savings</span>
            <span className="text-lg font-extrabold text-gray-900 dark:text-white mt-0.5">
              {loading ? '...' : `₹${stats.savings.toLocaleString('en-IN')}`}
            </span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-200/50 dark:border-gray-800/30 flex items-center gap-4">
          <div className="bg-cyan-100 dark:bg-cyan-950/40 p-3 rounded-xl text-cyan-600 dark:text-cyan-400">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Active Plots</span>
            <span className="text-lg font-extrabold text-gray-900 dark:text-white mt-0.5">
              {loading ? '...' : `${stats.farmCount} Plots`}
            </span>
          </div>
        </div>
      </div>

      {/* Weather Intelligence & Voice Assistant Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <WeatherAlertsWidget />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <SmartAgriVoice />

          <div className="glass-panel p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/30 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-green-500" />
                📋 Today's Priority Actions Checklist
              </h4>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                {dailyActions.filter(a => a.completed).length} / {dailyActions.length} Done
              </span>
            </div>

            <div className="space-y-2.5">
              {dailyActions.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleAction(item.id)}
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    item.completed 
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-900/30 text-emerald-900 dark:text-emerald-300 line-through' 
                      : 'bg-white dark:bg-gray-900/60 border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200 hover:border-green-500'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => {}}
                    className="h-4 w-4 rounded accent-green-600 cursor-pointer"
                  />
                  <span className="text-xs font-semibold leading-snug">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feature 1: AI Satellite Crop Health NDVI Analyzer */}
      <NdviSatelliteAnalyzer farm={primaryFarm} />

      {/* Feature 2 & Bonus: 30-Day Mandi Price Predictor & Fertilizer/Chemical Price Index */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6">
          <PricePredictorWidget />
        </div>
        <div className="lg:col-span-6">
          <InputPricesWidget />
        </div>
      </div>

      {/* Feature 4: PMFBY Crop Loss Insurance Claim Assistant */}
      <InsuranceClaimAssistant />

      {/* Mandi Live Spot Rates & Disease Monitoring Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/30 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800/50 pb-3">
            <h4 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" />
              🐛 Active Disease Monitoring
            </h4>
            <Link to="/ai-studio" className="text-xs font-bold text-green-600 dark:text-green-400 hover:underline">
              View All Reports
            </Link>
          </div>

          {activeDiseaseReport ? (
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-gray-400">Recent Diagnosis</span>
                  <h5 className="font-extrabold text-base text-gray-900 dark:text-white mt-0.5">
                    {activeDiseaseReport.cropName} — {activeDiseaseReport.diseaseName}
                  </h5>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${activeDiseaseReport.status === 'Resolved' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                  {activeDiseaseReport.status}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-gray-400">
                  <span>Treatment Plan Progress</span>
                  <span>
                    {activeDiseaseReport.treatmentPlan.filter(s => s.completed).length} / {activeDiseaseReport.treatmentPlan.length} Steps Completed
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-300"
                    style={{
                      width: `${(activeDiseaseReport.treatmentPlan.filter(s => s.completed).length / activeDiseaseReport.treatmentPlan.length) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-gray-500 bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl">
              <ShieldCheck className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-bold text-gray-800 dark:text-gray-200">No Active Disease Ingests</p>
              <p className="text-[10px] text-gray-400 mt-1">Upload leaf photos in the AI Studio to generate diagnostic treatment timelines.</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-6">
          <MandiPricesWidget />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
