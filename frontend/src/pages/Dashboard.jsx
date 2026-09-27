import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import API from '../services/api';
import { Sprout, MapPin, CloudSun, AlertTriangle, CheckCircle2, Calendar, ArrowRight, Camera, Droplet, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  // Priority Attention Items (Capped at Max 3)
  const [attentionItems] = useState([
    { id: 1, title: 'Perform Leaf Spot Inspection on Tomato Plot A', reason: 'High atmospheric humidity increases early leaf spot risk', link: '/ai-studio', btnText: 'Check Leaf', urgent: true },
    { id: 2, title: 'Check Field Drainage Lines Ahead of Rain', reason: 'Prevent root zone water stagnation', link: '/weather-alerts', btnText: 'Review Weather', urgent: false },
    { id: 3, title: 'Top Dressing Neem Coated Urea (Cotton)', reason: 'Due in 2 days for optimal tillering', link: '/crops', btnText: 'View Crop', urgent: false }
  ]);

  // Recent Activity (Capped at Max 3)
  const [recentActivities] = useState([
    { id: 1, action: 'Leaf Diagnostic Scan Completed', time: 'Today', result: 'Tomato - Early Blight (Moderate)' },
    { id: 2, action: 'Soil Moisture Telemetry Logged', time: 'Yesterday', result: '35% Moisture - Optimal' },
    { id: 3, action: 'PM-Kisan Scheme Claim Verified', time: '3 days ago', result: 'Installment Disbursed' }
  ]);

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
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 text-left pb-10 max-w-full">
      {/* 1. TOP AREA — SIMPLE HEADER & FARM CONTEXT */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">
            Good morning, {user?.profile?.name || 'Farmer'} 👨‍🌾
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-900/30">
              {selectedFarm ? `${selectedFarm.name} · ${selectedFarm.area || 2.5} Acres` : 'Green Valley Plot A · 2.5 Acres'}
            </span>
            <span className="text-xs text-slate-500 font-medium">Tomato · Flowering Stage</span>
          </div>
        </div>

        {/* ONE PRIMARY CONTEXTUAL ACTION BUTTON */}
        <Link 
          to="/ai-studio"
          className="self-start sm:self-center px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
        >
          <Camera className="w-4 h-4" />
          <span>Check Plant Health</span>
        </Link>
      </div>

      {/* 2. TODAY'S ATTENTION BANNER */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 rounded-xl mt-0.5 flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-amber-200 text-amber-900 rounded inline-block mb-1">WEATHER ALERT</span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
              Rain forecast (70% probability) expected tomorrow afternoon.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Recommended: Review drip irrigation schedule today to prevent waterlogging.
            </p>
          </div>
        </div>
        <Link 
          to="/weather-alerts"
          className="self-start sm:self-center px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition whitespace-nowrap shadow-xs"
        >
          View Details
        </Link>
      </div>

      {/* 3. TODAY AT A GLANCE (Compact Orientation Block) */}
      <div className="agri-card p-4">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5">TODAY AT A GLANCE</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 text-[11px] block font-medium">Weather</span>
            <span className="font-extrabold text-slate-900 dark:text-white text-sm block mt-0.5">28°C · Rain Possible</span>
            <span className="text-[10px] text-emerald-700 font-semibold">70% Humidity</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 text-[11px] block font-medium">Main Crop</span>
            <span className="font-extrabold text-slate-900 dark:text-white text-sm block mt-0.5">Tomato · Flowering</span>
            <span className="text-[10px] text-slate-500 font-semibold">Age: 45 Days</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 text-[11px] block font-medium">Irrigation Action</span>
            <span className="font-extrabold text-amber-700 dark:text-amber-400 text-sm block mt-0.5">Review Irrigation</span>
            <span className="text-[10px] text-slate-500 font-semibold">Hold Rain Application</span>
          </div>
        </div>
      </div>

      {/* 4. WHAT NEEDS YOUR ATTENTION (Capped at Max 3) */}
      <div className="agri-card p-4 sm:p-5">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              What Needs Your Attention
            </h3>
            <p className="text-[11px] text-slate-500">Actionable priority tasks (Max 3 shown)</p>
          </div>
          <Link to="/crops" className="text-xs font-bold text-emerald-700 hover:underline">
            View All Tasks →
          </Link>
        </div>

        <div className="space-y-2">
          {attentionItems.map(item => (
            <div key={item.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <div className={`p-1.5 rounded-lg mt-0.5 flex-shrink-0 ${item.urgent ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'}`}>
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block leading-snug">{item.title}</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">{item.reason}</span>
                </div>
              </div>
              <Link to={item.link} className="self-start sm:self-center px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold rounded-lg transition whitespace-nowrap">
                {item.btnText}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 5. WEATHER & FARMING IMPACT (Compact Layout) */}
      <div className="agri-card p-4 sm:p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CloudSun className="w-4.5 h-4.5 text-emerald-600" />
            Weather & Farming Impact
          </h3>
          <Link to="/weather-alerts" className="text-xs font-bold text-emerald-700 hover:underline">
            View Full Forecast →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Temperature:</span>
              <span className="font-bold text-slate-800 dark:text-white">28°C (High 31°C / Low 22°C)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Rain Probability:</span>
              <span className="font-bold text-amber-600">70% (Light Rain Tomorrow)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Relative Humidity:</span>
              <span className="font-bold text-slate-800 dark:text-white">76%</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block mb-1">Direct Farming Impact</span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                High humidity combined with upcoming rainfall creates favorable conditions for fungal leaf spots. Inspect lower foliage today.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. MY CROPS & RECENT ACTIVITY (Split Compact Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* MY CROPS (7 cols) */}
        <div className="md:col-span-7 agri-card p-4 sm:p-5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sprout className="w-4.5 h-4.5 text-emerald-600" />
              My Active Crops
            </h3>
            <Link to="/crops" className="text-xs font-bold text-emerald-700 hover:underline">
              View All →
            </Link>
          </div>

          <div className="agri-table-container">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-2 pl-2">Crop</th>
                  <th className="pb-2">Area</th>
                  <th className="pb-2">Stage</th>
                  <th className="pb-2">Condition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-800 dark:text-slate-200">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2 pl-2 font-bold text-slate-900 dark:text-white">Tomato</td>
                  <td className="py-2">2.5 Acres</td>
                  <td className="py-2">Flowering</td>
                  <td className="py-2"><span className="badge-healthy">Healthy</span></td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2 pl-2 font-bold text-slate-900 dark:text-white">Wheat</td>
                  <td className="py-2">1.8 Acres</td>
                  <td className="py-2">Vegetative</td>
                  <td className="py-2"><span className="badge-warning">Monitor</span></td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2 pl-2 font-bold text-slate-900 dark:text-white">Cotton</td>
                  <td className="py-2">3.0 Acres</td>
                  <td className="py-2">Squaring</td>
                  <td className="py-2"><span className="badge-healthy">Healthy</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* RECENT ACTIVITY (5 cols) */}
        <div className="md:col-span-5 agri-card p-4 sm:p-5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Activity
            </h3>
            <Link to="/crops" className="text-xs font-bold text-emerald-700 hover:underline">
              History →
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentActivities.map(act => (
              <div key={act.id} className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 dark:text-slate-100">{act.action}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{act.time}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{act.result}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
