import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { FlaskConical, Tag, TrendingUp, TrendingDown, Minus, CheckCircle, AlertTriangle, ShieldCheck, Filter } from 'lucide-react';

const InputPricesWidget = () => {
  const [prices, setPrices] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInputPrices();
  }, []);

  const fetchInputPrices = async () => {
    try {
      setLoading(true);
      const res = await API.get('/inputs/prices');
      if (res.data.success) {
        setPrices(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching input prices:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrices = activeCategory === 'All' 
    ? prices 
    : prices.filter(p => p.category === activeCategory);

  const getTrendIcon = (trend) => {
    if (trend === 'RISING') return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (trend === 'FALLING') return <TrendingDown className="h-4 w-4 text-emerald-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="glass-panel p-6 rounded-3xl animate-pulse space-y-4">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/30 text-left space-y-5">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wide text-green-600 dark:text-green-400">Krishi Kendra Index</span>
          <h3 className="font-extrabold text-xl text-gray-900 dark:text-white flex items-center gap-2 mt-0.5">
            <FlaskConical className="h-6 w-6 text-green-500" />
            Fertilizer & Chemical Price Index
          </h3>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-gray-100 dark:bg-gray-800/60 rounded-xl text-xs">
          {['All', 'Fertilizer', 'Fungicide', 'Pesticide', 'Bio-Control'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeCategory === cat 
                  ? 'bg-white dark:bg-gray-900 text-green-600 shadow' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Input Price Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPrices.map((item) => (
          <div key={item._id} className="p-4 rounded-2xl bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 space-y-3 shadow-sm hover:border-green-500/50 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-wide text-gray-400">{item.category} • {item.unit}</span>
                <h4 className="font-extrabold text-base text-gray-900 dark:text-white">{item.name}</h4>
              </div>
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
                {getTrendIcon(item.trend)}
                <span className="text-[10px] font-extrabold text-gray-600 dark:text-gray-300">{item.trend}</span>
              </div>
            </div>

            {/* Price Comparison */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 dark:border-gray-800/50">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 block uppercase">Govt Co-op Rate</span>
                <span className="text-base font-black text-emerald-800 dark:text-emerald-200">₹{item.govtRate}</span>
                {item.subsidyPct > 0 && (
                  <span className="text-[9px] font-extrabold text-emerald-600 block mt-0.5">({item.subsidyPct}% Subsidy)</span>
                )}
              </div>

              <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                <span className="text-[9px] font-bold text-gray-400 block uppercase">Private Dealer</span>
                <span className="text-base font-black text-gray-900 dark:text-white">₹{item.privateRate}</span>
                <span className="text-[9px] font-bold text-gray-400 block mt-0.5">Stock: {item.availability}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InputPricesWidget;
