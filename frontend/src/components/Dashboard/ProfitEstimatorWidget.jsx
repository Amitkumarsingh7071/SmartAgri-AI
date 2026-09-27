import React, { useState } from 'react';
import { Calculator, TrendingUp, DollarSign } from 'lucide-react';

const ProfitEstimatorWidget = () => {
  const [area, setArea] = useState(2.0); // Acres
  const [crop, setCrop] = useState('Tomato');
  const [seedCost, setSeedCost] = useState(4500);
  const [fertCost, setFertCost] = useState(6200);
  const [labourCost, setLabourCost] = useState(12000);
  const [pesticideCost, setPesticideCost] = useState(3800);
  const [expectedYieldQuintal, setExpectedYieldQuintal] = useState(120); // Quintals
  const [pricePerQuintal, setPricePerQuintal] = useState(2800); // ₹ / Quintal

  const totalCost = parseFloat(seedCost || 0) + parseFloat(fertCost || 0) + parseFloat(labourCost || 0) + parseFloat(pesticideCost || 0);
  const expectedRevenue = parseFloat(expectedYieldQuintal || 0) * parseFloat(pricePerQuintal || 0);
  const estimatedProfit = expectedRevenue - totalCost;
  const breakEvenPrice = expectedYieldQuintal > 0 ? (totalCost / expectedYieldQuintal).toFixed(1) : 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Farm Profit & Cost Estimator</h3>
            <p className="text-xs text-slate-500">Calculate Expected Input Expenses, Yield Revenue & Net Profit</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
          Financial Decision Support
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Land Area (Acres)</label>
              <input 
                type="number"
                value={area}
                onChange={e => setArea(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Crop Variety</label>
              <input 
                type="text"
                value={crop}
                onChange={e => setCrop(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Seed Cost (₹)</label>
              <input 
                type="number"
                value={seedCost}
                onChange={e => setSeedCost(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Fertilizer Cost (₹)</label>
              <input 
                type="number"
                value={fertCost}
                onChange={e => setFertCost(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Labour Charges (₹)</label>
              <input 
                type="number"
                value={labourCost}
                onChange={e => setLabourCost(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Pesticide / Spray (₹)</label>
              <input 
                type="number"
                value={pesticideCost}
                onChange={e => setPesticideCost(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Expected Yield (Quintals)</label>
              <input 
                type="number"
                value={expectedYieldQuintal}
                onChange={e => setExpectedYieldQuintal(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Mandi Price (₹/Quintal)</label>
              <input 
                type="number"
                value={pricePerQuintal}
                onChange={e => setPricePerQuintal(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 rounded-lg outline-none"
              />
            </div>
          </div>
        </div>

        {/* Calculation summary card */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Financial Forecast Breakdown</h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">Total Production Cost:</span>
                <span className="font-bold text-slate-800">₹{totalCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">Gross Expected Revenue:</span>
                <span className="font-bold text-emerald-700">₹{expectedRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200">
                <span className="text-slate-600">Break-Even Selling Price:</span>
                <span className="font-bold text-amber-700">₹{breakEvenPrice} / Quintal</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Estimated Net Profit / Loss</span>
            <p className={`text-2xl font-black mt-0.5 ${estimatedProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              ₹{estimatedProfit.toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-slate-400 mt-1 italic">
              Advisory: Financial calculations are estimations based on entered parameters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitEstimatorWidget;
