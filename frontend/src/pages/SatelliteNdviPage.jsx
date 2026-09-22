import React, { useState, useEffect } from 'react';
import NdviSatelliteAnalyzer from '../components/Maps/NdviSatelliteAnalyzer';
import API from '../services/api';
import { Globe, Info } from 'lucide-react';

const SatelliteNdviPage = () => {
  const [primaryFarm, setPrimaryFarm] = useState(null);

  useEffect(() => {
    const fetchFarm = async () => {
      try {
        const res = await API.get('/farms');
        if (res.data.success && res.data.data.length > 0) {
          setPrimaryFarm(res.data.data[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchFarm();
  }, []);

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* Top Farmer Explanation Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-600 to-emerald-700 text-white shadow-lg relative overflow-hidden">
        <div className="flex items-start gap-3 relative z-10">
          <Info className="h-6 w-6 text-teal-200 mt-0.5 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-extrabold">📡 Satellite NDVI Crop Health Guide</h2>
            <p className="text-xs text-teal-100 mt-1 leading-relaxed">
              This map uses multi-spectral satellite imagery to measure crop chlorophyll and leaf vigor. 
              <strong> Green areas</strong> represent healthy dense crops, <strong>Blue areas</strong> show normal canopy, and <strong>Yellow areas</strong> highlight dry or water-stressed patches needing attention.
            </p>
          </div>
        </div>
      </div>

      <NdviSatelliteAnalyzer farm={primaryFarm} />
    </div>
  );
};

export default SatelliteNdviPage;
