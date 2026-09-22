import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Calendar, DollarSign, Award, ArrowUpRight, Sparkles } from 'lucide-react';

const PricePredictorWidget = () => {
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPriceForecast(selectedCrop);
  }, [selectedCrop]);

  const fetchPriceForecast = async (crop) => {
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/predict-price-trend', {
        crop_name: crop
      });
      if (res.data.success) {
        setForecastData(res.data);
      }
    } catch (err) {
      console.error('Error fetching price forecast:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/30 text-left space-y-5">
      {/* Header & Crop Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wide text-green-600 dark:text-green-400">ML Time-Series Predictive Intelligence</span>
          <h3 className="font-extrabold text-xl text-gray-900 dark:text-white flex items-center gap-2 mt-0.5">
            <TrendingUp className="h-6 w-6 text-green-500" />
            30-Day Mandi Price Predictor
          </h3>
        </div>

        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-900 dark:text-white focus:outline-none"
        >
          <option value="Tomato">Tomato</option>
          <option value="Wheat">Wheat</option>
          <option value="Cotton">Cotton</option>
          <option value="Rice">Rice</option>
          <option value="Maize">Maize</option>
        </select>
      </div>

      {loading ? (
        <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
      ) : forecastData ? (
        <div className="space-y-4">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Current Market Rate</span>
              <span className="text-lg font-black text-gray-900 dark:text-white mt-0.5 block">₹{forecastData.current_price} / Quintal</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase block">Expected Peak Rate</span>
              <span className="text-lg font-black text-emerald-800 dark:text-emerald-200 mt-0.5 block">₹{forecastData.expected_peak_price} / Quintal</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase block">Best Time to Sell</span>
              <span className="text-lg font-black text-amber-800 dark:text-amber-200 mt-0.5 block">{forecastData.best_sell_day}</span>
            </div>
          </div>

          {/* Sell Recommendation Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
              {forecastData.recommendation}
            </p>
          </div>

          {/* 30-Day Forecast Points Bar Preview */}
          <div className="pt-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-2">30-Day Daily Rate Trajectory</span>
            <div className="grid grid-cols-10 gap-1.5 overflow-x-auto pb-1">
              {forecastData.forecast_30d.slice(0, 10).map((pt, i) => (
                <div key={i} className="p-2 text-center rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 min-w-[65px]">
                  <span className="text-[9px] font-bold text-gray-400 block">{pt.day}</span>
                  <span className="text-xs font-black text-green-600 dark:text-green-400 mt-0.5 block">₹{pt.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PricePredictorWidget;
