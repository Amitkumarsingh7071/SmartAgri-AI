import React from 'react';
import WeatherAlertsWidget from '../components/Dashboard/WeatherAlertsWidget';
import BiosecurityHotspotMap from '../components/Maps/BiosecurityHotspotMap';
import { CloudRain, Info } from 'lucide-react';

const WeatherAlertsPage = () => {
  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* Top Farmer Explanation Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg relative overflow-hidden">
        <div className="flex items-start gap-3 relative z-10">
          <Info className="h-6 w-6 text-blue-200 mt-0.5 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-extrabold">🌾 Weather-Based Farming Alerts & Biosecurity Guide</h2>
            <p className="text-xs text-blue-100 mt-1 leading-relaxed">
              This intelligence tool monitors weather telemetry and regional biosecurity hotspots. 
              <strong> Review the recommended actions below</strong> before irrigating or applying fertilizers to prevent crop damage and disease outbreak.
            </p>
          </div>
        </div>
      </div>

      <WeatherAlertsWidget />
      <BiosecurityHotspotMap />
    </div>
  );
};

export default WeatherAlertsPage;
