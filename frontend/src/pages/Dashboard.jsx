import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import WeatherWidget from '../components/Dashboard/WeatherWidget';
import MandiPricesWidget from '../components/Dashboard/MandiPricesWidget';
import VoiceAssistant from '../components/Voice/VoiceAssistant';
import API from '../services/api';
import { Sprout, Map, Coins, HelpCircle, ArrowUpRight, Award, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    farmCount: 0,
    cropCount: 0,
    totalArea: 0,
    savings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Fetch farms, crops, finances in parallel
        const [farmsRes, cropsRes, financeRes] = await Promise.all([
          API.get('/farms'),
          API.get('/crops'),
          API.get('/finance/analytics')
        ]);

        const farmData = farmsRes.data.data || [];
        const cropData = cropsRes.data.data || [];
        const financeData = financeRes.data.data || { totalIncome: 0, totalExpense: 0 };

        const totalArea = farmData.reduce((sum, f) => sum + (f.area || 0), 0);
        const activeCrops = cropData.filter(c => c.stage !== 'Harvested').length;

        setStats({
          farmCount: farmData.length,
          cropCount: activeCrops,
          totalArea: totalArea.toFixed(1),
          savings: (financeData.totalIncome - financeData.totalExpense)
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-left">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6 md:p-8 shadow-lg">
        {/* Decorative Grid SVG overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="relative z-10 max-w-xl">
          <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 px-3 py-1 rounded-full border border-white/10">
            Farming Intelligence Dashboard
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-3">
            Welcome back, {user?.profile?.name || 'Farmer'}!
          </h1>
          <p className="text-xs text-green-100/90 mt-2 leading-relaxed">
            Monitor soil nutrients, check Mandi market fluctuations, and consult our agronomist AI model to optimize crop yields.
          </p>

          <div className="flex flex-wrap gap-2.5 mt-5">
            <Link
              to="/ai-studio"
              className="bg-white hover:bg-gray-100 text-green-700 font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              Consult AI Studio
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              to="/profile"
              className="bg-green-700/50 hover:bg-green-700/70 border border-green-400/30 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
            >
              View QR ID Card
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Counters Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total area */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/30 flex items-center gap-4">
          <div className="bg-green-100 dark:bg-green-950/40 p-3 rounded-xl text-green-600 dark:text-green-400">
            <Map className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Total Land</span>
            <span className="text-lg font-extrabold text-gray-900 dark:text-white mt-0.5">
              {loading ? '...' : `${stats.totalArea} Acres`}
            </span>
          </div>
        </div>

        {/* Total farms */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/30 flex items-center gap-4">
          <div className="bg-emerald-100 dark:bg-emerald-950/40 p-3 rounded-xl text-emerald-600 dark:text-emerald-400">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Farms Managed</span>
            <span className="text-lg font-extrabold text-gray-900 dark:text-white mt-0.5">
              {loading ? '...' : stats.farmCount} Plots
            </span>
          </div>
        </div>

        {/* Active crops */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/30 flex items-center gap-4">
          <div className="bg-amber-100 dark:bg-amber-950/40 p-3 rounded-xl text-amber-600 dark:text-amber-400">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Growing Crops</span>
            <span className="text-lg font-extrabold text-gray-900 dark:text-white mt-0.5">
              {loading ? '...' : stats.cropCount} Varieties
            </span>
          </div>
        </div>

        {/* Financial savings */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/30 flex items-center gap-4">
          <div className="bg-blue-100 dark:bg-blue-950/40 p-3 rounded-xl text-blue-600 dark:text-blue-400">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Net Savings</span>
            <span className={`text-lg font-extrabold mt-0.5 block ${stats.savings >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {loading ? '...' : `₹${stats.savings}`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Widgets Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather Widget */}
        <WeatherWidget location={user?.profile?.state} />

        {/* Mandi Prices Widget */}
        <MandiPricesWidget />
      </div>

      {/* Voice Assistant Panel */}
      <VoiceAssistant />
    </div>
  );
};

export default Dashboard;
