import React from 'react';
import InputPricesWidget from '../components/Dashboard/InputPricesWidget';
import { FlaskConical, Info } from 'lucide-react';

const InputPricesPage = () => {
  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* Top Farmer Explanation Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg relative overflow-hidden">
        <div className="flex items-start gap-3 relative z-10">
          <Info className="h-6 w-6 text-emerald-200 mt-0.5 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-extrabold">🧪 Fertilizer & Chemical Price Index Guide</h2>
            <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
              Compare <strong>Government Cooperative Rates</strong> against private dealer prices for Urea, DAP, NPK, and pesticides. 
              Look for the <strong>Subsidy % badge</strong> to buy input bags at government-discounted rates.
            </p>
          </div>
        </div>
      </div>

      <InputPricesWidget />
    </div>
  );
};

export default InputPricesPage;
