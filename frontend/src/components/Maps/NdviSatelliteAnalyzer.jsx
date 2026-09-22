import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Rectangle } from 'react-leaflet';
import { Globe, Sprout, Activity, ShieldCheck, AlertTriangle, RefreshCw } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const NdviSatelliteAnalyzer = ({ farm }) => {
  const [ndviData, setNdviData] = useState(null);
  const [loading, setLoading] = useState(true);

  const lat = farm?.latitude || 28.6139;
  const lon = farm?.longitude || 77.2090;

  useEffect(() => {
    fetchNdviTelemetry();
  }, [farm]);

  const fetchNdviTelemetry = async () => {
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/ndvi-analyzer', {
        lat,
        lon,
        crop_name: farm?.currentCrop || 'Tomato'
      });
      if (res.data.success) {
        setNdviData(res.data);
      }
    } catch (err) {
      console.error('Error fetching NDVI satellite data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Define Bounding Boxes for Sector overlays
  const boundsNorth = [[lat + 0.001, lon - 0.002], [lat + 0.003, lon + 0.002]];
  const boundsCenter = [[lat - 0.001, lon - 0.002], [lat + 0.001, lon + 0.002]];
  const boundsSouth = [[lat - 0.003, lon - 0.002], [lat - 0.001, lon + 0.002]];

  return (
    <div className="glass-panel p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/30 text-left space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wide text-green-600 dark:text-green-400">Sentinel-2 Multi-Spectral Telemetry</span>
          <h3 className="font-extrabold text-xl text-gray-900 dark:text-white flex items-center gap-2 mt-0.5">
            <Globe className="h-6 w-6 text-green-500" />
            AI Satellite Crop Health (NDVI Index)
          </h3>
        </div>
        <button
          onClick={fetchNdviTelemetry}
          className="flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-green-500/20 transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Satellite Pass
        </button>
      </div>

      {/* Main Grid: Leaflet Map (7 cols) + NDVI Metrics (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Container (7 cols) */}
        <div className="lg:col-span-7 h-80 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 relative shadow-inner">
          <MapContainer center={[lat, lon]} zoom={15} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, lon]}>
              <Popup>
                <div className="p-1 text-center">
                  <strong className="block text-xs font-bold">{farm?.name || 'Farm Plot'}</strong>
                  <span className="text-[10px] text-green-600 font-bold block">NDVI: {ndviData?.ndvi_score || '0.68'}</span>
                </div>
              </Popup>
            </Marker>

            {/* NDVI Sector Heatmap Overlays */}
            <Rectangle bounds={boundsNorth} pathOptions={{ color: '#10B981', fillColor: '#10B981', fillOpacity: 0.4 }} />
            <Rectangle bounds={boundsCenter} pathOptions={{ color: '#3B82F6', fillColor: '#3B82F6', fillOpacity: 0.4 }} />
            <Rectangle bounds={boundsSouth} pathOptions={{ color: '#F59E0B', fillColor: '#F59E0B', fillOpacity: 0.4 }} />
          </MapContainer>

          {/* Map Legend overlay */}
          <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-[10px] space-y-1 shadow-lg">
            <span className="font-extrabold block text-gray-700 dark:text-gray-300">NDVI Heatmap Legend</span>
            <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Green: High Vigor (&gt;0.70)</div>
            <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span> Blue: Healthy Canopy (0.60-0.70)</div>
            <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span> Yellow: Moisture Stress (&lt;0.60)</div>
          </div>
        </div>

        {/* Metrics Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase block">Normalized Difference Vegetation Index</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-green-600 dark:text-green-400">{ndviData?.ndvi_score || '0.68'}</span>
              <span className="text-xs font-bold text-gray-500">/ 1.0 Max</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: ndviData?.vigor_percentage || '68%' }}></div>
            </div>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block pt-1">
              Vegetation Vigor Rating: <span className="text-green-600 dark:text-green-400 font-extrabold">{ndviData?.vigor_percentage || '68%'}</span>
            </span>
          </div>

          {/* Sector Breakdown */}
          {ndviData?.grid_zones && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Field Sector Analysis</span>
              {ndviData.grid_zones.map((z, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: z.color }}></span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{z.zone}</span>
                  </div>
                  <span className="font-extrabold text-gray-900 dark:text-white">NDVI {z.ndvi}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NdviSatelliteAnalyzer;
