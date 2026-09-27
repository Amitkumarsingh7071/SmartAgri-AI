import React, { useState } from 'react';
import { Droplet, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

const SmartIrrigationWidget = () => {
  const [cropName, setCropName] = useState('Tomato');
  const [soilMoisture, setSoilMoisture] = useState(35);
  const [rainForecast, setRainForecast] = useState(5);
  const [temp, setTemp] = useState(29);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({
    action: "IRRIGATE IN EVENING",
    urgency: "MEDIUM",
    reasoning: "High ambient temperature (29°C) causing evapotranspiration. Evening drip watering recommended.",
    water_volume_liters_acre: 4500,
    recommended_method: "Drip Irrigation (Early Morning / Evening)",
    disclaimer: "Advisory Note: Always inspect field soil condition directly prior to running pumps."
  });

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/smart-irrigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop_name: cropName,
          crop_age_days: 35,
          soil_type: "Loamy Black Soil",
          soil_moisture_pct: parseFloat(soilMoisture),
          rain_forecast_mm: parseFloat(rainForecast),
          temp_c: parseFloat(temp)
        })
      });
      const data = await res.json();
      if (data.success) {
        setResult(data);
      }
    } catch (err) {
      console.error("Irrigation Calculation Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Smart Irrigation Advisory</h3>
            <p className="text-xs text-slate-500">Weather & Soil Telemetry-Based Irrigation Decisions</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
          Live Decision Engine
        </span>
      </div>

      <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Crop</label>
          <select 
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="Tomato">Tomato</option>
            <option value="Wheat">Wheat</option>
            <option value="Cotton">Cotton</option>
            <option value="Rice">Rice</option>
            <option value="Maize">Maize</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Soil Moisture (%)</label>
          <input 
            type="number"
            value={soilMoisture}
            onChange={(e) => setSoilMoisture(e.target.value)}
            className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Rain Forecast (mm)</label>
          <input 
            type="number"
            value={rainForecast}
            onChange={(e) => setRainForecast(e.target.value)}
            className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg transition flex items-center justify-center gap-1"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Recalculate"}
          </button>
        </div>
      </form>

      {result && (
        <div className={`p-4 rounded-xl border ${result.action.includes('DO NOT') ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {result.action.includes('DO NOT') ? (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              ) : (
                <CheckCircle className="w-5 h-5 text-blue-600" />
              )}
              <span className="font-bold text-sm text-slate-800">{result.action}</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded font-semibold bg-white text-slate-700 shadow-xs border">
              Urgency: {result.urgency}
            </span>
          </div>

          <p className="text-xs text-slate-700 mb-3">{result.reasoning}</p>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-100">
            <div>
              <span className="font-semibold text-slate-500">Target Volume:</span>
              <p className="font-bold text-slate-800">{result.water_volume_liters_acre} Liters/Acre</p>
            </div>
            <div>
              <span className="font-semibold text-slate-500">Method:</span>
              <p className="font-bold text-slate-800">{result.recommended_method}</p>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 mt-2 italic">{result.disclaimer}</p>
        </div>
      )}
    </div>
  );
};

export default SmartIrrigationWidget;
