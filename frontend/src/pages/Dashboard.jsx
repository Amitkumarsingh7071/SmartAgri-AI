import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import WeatherAlertsWidget from '../components/Dashboard/WeatherAlertsWidget';
import SmartAgriVoice from '../components/Voice/SmartAgriVoice';
import MandiPricesWidget from '../components/Dashboard/MandiPricesWidget';
import PricePredictorWidget from '../components/Dashboard/PricePredictorWidget';
import InputPricesWidget from '../components/Dashboard/InputPricesWidget';
import SmartIrrigationWidget from '../components/Dashboard/SmartIrrigationWidget';
import CropCalendarWidget from '../components/Dashboard/CropCalendarWidget';
import ProfitEstimatorWidget from '../components/Dashboard/ProfitEstimatorWidget';
import BiosecurityHotspotMap from '../components/Maps/BiosecurityHotspotMap';
import NdviSatelliteAnalyzer from '../components/Maps/NdviSatelliteAnalyzer';
import InsuranceClaimAssistant from '../components/Insurance/InsuranceClaimAssistant';
import API from '../services/api';
import { Sprout, MapPin, CloudSun, AlertTriangle, CheckCircle2, Calendar, ArrowRight, ShieldCheck, Camera, Droplet } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [farmsRes, cropsRes] = await Promise.all([
        API.get('/farms'),
        API.get('/crops')
      ]);

      const farmData = farmsRes.data.data || [];
      const cropData = cropsRes.data.data || [];

      setFarms(farmData);
      if (farmData.length > 0) {
        setSelectedFarm(farmData[0]);
      }
      setCrops(cropData);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left pb-8">
      {/* SECTION 1 — SIMPLE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
            Good morning, {user?.profile?.name || 'Farmer'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Here is what needs your attention on your farm today.
          </p>
        </div>

        {/* Farm Selector Dropdown */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <select 
            value={selectedFarm?._id || ''}
            onChange={(e) => {
              const selected = farms.find(f => f._id === e.target.value);
              if (selected) setSelectedFarm(selected);
            }}
            className="text-xs font-bold text-slate-800 dark:text-slate-100 bg-transparent outline-none cursor-pointer"
          >
            {farms.length > 0 ? (
              farms.map(f => (
                <option key={f._id} value={f._id}>{f.name} ({f.area || 2.5} Acres)</option>
              ))
            ) : (
              <option value="">Green Valley Plot A (2.5 Acres)</option>
            )}
          </select>
        </div>
      </div>

      {/* SECTION 2 — TODAY'S CRITICAL ALERT */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 rounded-xl mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-amber-200 text-amber-900 rounded">WEATHER & IRRIGATION ALERT</span>
              <span className="text-xs text-slate-500 font-semibold">Priority Today</span>
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1">
              Rain forecast (70% probability) expected tomorrow afternoon.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Action Required: Hold overhead sprinkler irrigation for Tomato Plot A today to prevent waterlogging.
            </p>
          </div>
        </div>
        <Link 
          to="/weather-alerts"
          className="self-start md:self-center px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition whitespace-nowrap shadow-xs"
        >
          Review Action Details
        </Link>
      </div>

      {/* SECTION 3 — TODAY AT A GLANCE */}
      <div className="agri-card p-4">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">TODAY AT A GLANCE</span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 text-[11px] block font-medium">Today's Weather</span>
            <span className="font-extrabold text-slate-900 dark:text-white text-sm block mt-0.5">28°C • Rain 70%</span>
            <span className="text-[10px] text-emerald-700 font-semibold">Humid Air</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 text-[11px] block font-medium">Main Crop Stage</span>
            <span className="font-extrabold text-slate-900 dark:text-white text-sm block mt-0.5">Tomato • Flowering</span>
            <span className="text-[10px] text-slate-500 font-semibold">Age: 45 Days</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 text-[11px] block font-medium">Irrigation Advice</span>
            <span className="font-extrabold text-amber-700 dark:text-amber-400 text-sm block mt-0.5">Skip Watering</span>
            <span className="text-[10px] text-slate-500 font-semibold">Rain Incoming</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 text-[11px] block font-medium">Foliage Health Status</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm block mt-0.5">Healthy Canopy</span>
            <span className="text-[10px] text-slate-500 font-semibold">No Active Blight</span>
          </div>
        </div>
      </div>

      {/* SECTION 4 — WHAT NEEDS YOUR ATTENTION */}
      <div className="agri-card p-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
              What Needs Your Attention Today
            </h3>
            <p className="text-xs text-slate-500">Actionable tasks prioritized by farming urgency</p>
          </div>
          <Link to="/crops" className="text-xs font-bold text-emerald-700 hover:underline">
            View All Tasks →
          </Link>
        </div>

        <div className="space-y-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/40 text-amber-700 rounded-lg">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">Perform Leaf Spot Inspection on Tomato Plot A</span>
                <span className="text-[11px] text-slate-500">Due Today • High humidity increases early leaf spot risk</span>
              </div>
            </div>
            <Link to="/ai-studio" className="px-3 py-1.5 bg-emerald-700 text-white text-xs font-bold rounded-lg hover:bg-emerald-800 transition">
              Check Leaf
            </Link>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 rounded-lg">
                <Droplet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">Check Field Drainage Lines Ahead of Tomorrow Rain</span>
                <span className="text-[11px] text-slate-500">Due Today • Prevent root zone water stagnation</span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-lg">
              Pending
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 5 — MY CROPS (Clean List) */}
      <div className="agri-card p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sprout className="w-4.5 h-4.5 text-emerald-600" />
            My Active Crops
          </h3>
          <Link to="/crops" className="text-xs font-bold text-emerald-700 hover:underline">
            Manage Register →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <th className="pb-2">Crop Name</th>
                <th className="pb-2">Area</th>
                <th className="pb-2">Stage</th>
                <th className="pb-2">Condition</th>
                <th className="pb-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-800 dark:text-slate-200">
              {crops.length > 0 ? (
                crops.map((c, i) => (
                  <tr key={c._id || i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white">{c.name}</td>
                    <td className="py-2.5">{c.area || 2.0} Acres</td>
                    <td className="py-2.5">{c.stage || 'Flowering'}</td>
                    <td className="py-2.5">
                      <span className="badge-healthy">Healthy</span>
                    </td>
                    <td className="py-2.5 text-right">
                      <Link to="/crops" className="text-emerald-700 font-bold hover:underline">View</Link>
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white">Tomato (Hybrid)</td>
                    <td className="py-2.5">2.5 Acres</td>
                    <td className="py-2.5">Flowering Stage</td>
                    <td className="py-2.5"><span className="badge-healthy">Healthy</span></td>
                    <td className="py-2.5 text-right"><Link to="/crops" className="text-emerald-700 font-bold hover:underline">View</Link></td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white">Wheat (Kalyan Sona)</td>
                    <td className="py-2.5">1.8 Acres</td>
                    <td className="py-2.5">Vegetative Stage</td>
                    <td className="py-2.5"><span className="badge-warning">Monitor Humidity</span></td>
                    <td className="py-2.5 text-right"><Link to="/crops" className="text-emerald-700 font-bold hover:underline">View</Link></td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 6 — WEATHER & FARMING IMPACT + VOICE ASSISTANT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <WeatherAlertsWidget />
        </div>
        <div className="lg:col-span-5">
          <SmartAgriVoice />
        </div>
      </div>

      {/* SECTION 7 — DECISION SUPPORT ENGINES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6">
          <SmartIrrigationWidget />
        </div>
        <div className="lg:col-span-6">
          <CropCalendarWidget />
        </div>
      </div>

      {/* SECTION 8 — PROFIT ESTIMATOR & BIOSECURITY SURVEILLANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6">
          <ProfitEstimatorWidget />
        </div>
        <div className="lg:col-span-6">
          <BiosecurityHotspotMap />
        </div>
      </div>

      {/* MARKET PRICING & FERTILIZER INDEX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6">
          <PricePredictorWidget />
        </div>
        <div className="lg:col-span-6">
          <InputPricesWidget />
        </div>
      </div>

      {/* SATELLITE NDVI CANOPY ANALYZER */}
      <NdviSatelliteAnalyzer farm={selectedFarm} />

      {/* INSURANCE CLAIMS */}
      <InsuranceClaimAssistant />
    </div>
  );
};

export default Dashboard;
