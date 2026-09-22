import React from 'react';
import PricePredictorWidget from '../components/Dashboard/PricePredictorWidget';
import MandiPricesWidget from '../components/Dashboard/MandiPricesWidget';
import { TrendingUp, Info } from 'lucide-react';

const PricePredictorPage = () => {
  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* Top Farmer Explanation Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-lg relative overflow-hidden">
        <div className="flex items-start gap-3 relative z-10">
          <Info className="h-6 w-6 text-purple-200 mt-0.5 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-extrabold">📈 30-Day Mandi Price Trend Predictor Guide</h2>
            <p className="text-xs text-purple-100 mt-1 leading-relaxed">
              Select your crop variety from the dropdown below. Machine Learning time-series models project market prices 30 days ahead 
              and recommend the <strong>Best Time to Sell</strong> your harvest for maximum profit.
            </p>
          </div>
        </div>
      </div>

      <PricePredictorWidget />
      <MandiPricesWidget />
    </div>
  );
};

export default PricePredictorPage;
