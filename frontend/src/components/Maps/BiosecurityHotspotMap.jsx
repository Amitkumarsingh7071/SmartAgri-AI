import React, { useState, useEffect } from 'react';
import { ShieldAlert, MapPin, Activity } from 'lucide-react';

const BiosecurityHotspotMap = () => {
  const [hotspots, setHotspots] = useState([
    { id: 1, region: 'Nashik Agriculture Zone', crop: 'Tomato', disease: 'Early Blight', severity: 'HIGH', incidents: 14, alert: 'POTENTIAL_HOTSPOT' },
    { id: 2, region: 'Pune District Farm Sector B', crop: 'Grape', disease: 'Black Rot', severity: 'MEDIUM', incidents: 6, alert: 'WATCH_ZONE' },
    { id: 3, region: 'Nagpur Citrus Region', crop: 'Orange', disease: 'Citrus Greening', severity: 'HIGH', incidents: 11, alert: 'BIOSECURITY_ALERT' },
    { id: 4, region: 'Ahmednagar Pulse Belt', crop: 'Legumes', disease: 'Healthy', severity: 'LOW', incidents: 0, alert: 'SAFE_ZONE' }
  ]);

  useEffect(() => {
    fetchHotspots();
  }, []);

  const fetchHotspots = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/farmer-features/biosecurity');
      const data = await res.json();
      if (data.success && data.hotspots.length > 0) {
        setHotspots(data.hotspots);
      }
    } catch (err) {
      console.error("Fetch biosecurity error:", err);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Biosecurity & Regional Hotspot Surveillance</h3>
            <p className="text-xs text-slate-500">Privacy-Protected Regional Disease Outbreak Monitoring</p>
          </div>
        </div>

        <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-semibold rounded-full flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 animate-pulse text-rose-600" />
          Surveillance Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {hotspots.map(h => (
          <div key={h.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100/80 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {h.region}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                h.severity === 'HIGH' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                h.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {h.alert}
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <p><span className="font-semibold text-slate-500">Affected Crop:</span> {h.crop}</p>
              <p><span className="font-semibold text-slate-500">Reported Infection:</span> {h.disease}</p>
              <p><span className="font-semibold text-slate-500">Recent Reports:</span> {h.incidents} incidents logged in region</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-slate-400 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
        Privacy Protection Notice: Farm locations are aggregated to regional zones. Exact private farm coordinates are never publicly exposed.
      </p>
    </div>
  );
};

export default BiosecurityHotspotMap;
