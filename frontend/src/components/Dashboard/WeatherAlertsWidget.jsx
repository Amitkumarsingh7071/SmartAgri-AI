import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { CloudRain, Sun, Wind, Droplets, AlertTriangle, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';

const WeatherAlertsWidget = () => {
  const [weather, setWeather] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWeatherAndAlerts();
  }, []);

  const fetchWeatherAndAlerts = async () => {
    try {
      setLoading(true);
      setError('');
      const [weatherRes, alertsRes] = await Promise.all([
        API.get('/weather'),
        API.get('/weather/alerts')
      ]);

      if (weatherRes.data.success) {
        setWeather(weatherRes.data.data);
      }
      if (alertsRes.data.success) {
        setAlerts(alertsRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching weather alerts:', err);
      setError('Failed to load weather telemetry.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500 text-white animate-pulse';
      case 'HIGH':
        return 'bg-amber-500 text-white';
      case 'MEDIUM':
        return 'bg-yellow-500 text-gray-900';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  if (loading) {
    return (
      <div className="glass-panel p-6 rounded-3xl animate-pulse space-y-4">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Today's Farm Weather Panel */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/30 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-green-600 dark:text-green-400">Live Weather Telemetry</span>
            <h3 className="font-extrabold text-xl text-gray-900 dark:text-white flex items-center gap-2 mt-0.5">
              <CloudRain className="h-6 w-6 text-green-500" />
              Today's Farm Weather — {weather?.city || 'Farm Location'}
            </h3>
          </div>
          <div className="flex items-center gap-2 bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-full text-xs font-bold">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
            Synced
          </div>
        </div>

        {/* Main Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/20 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
              <Sun className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Temperature</span>
              <span className="text-lg font-extrabold text-gray-900 dark:text-white">{weather?.temp}°C</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/20 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
              <CloudRain className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Rain Risk</span>
              <span className="text-lg font-extrabold text-gray-900 dark:text-white">{weather?.rainRisk}%</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/20 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-500">
              <Droplets className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Humidity</span>
              <span className="text-lg font-extrabold text-gray-900 dark:text-white">{weather?.humidity}%</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/20 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Wind className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Wind Speed</span>
              <span className="text-lg font-extrabold text-gray-900 dark:text-white">{weather?.windSpeed} km/h</span>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast Bar */}
        {weather?.forecast && (
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-3">7-Day Agricultural Forecast</span>
            <div className="grid grid-cols-7 gap-2 overflow-x-auto pb-1">
              {weather.forecast.map((f, i) => (
                <div key={i} className="p-2.5 text-center rounded-xl bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800/50 min-w-[70px]">
                  <span className="text-[10px] font-bold text-gray-500 block">{f.day}</span>
                  <span className="text-xs font-black text-gray-900 dark:text-white my-1 block">{f.temp}°C</span>
                  <span className="text-[9px] text-blue-500 font-bold block">💧 {f.rainRisk}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Weather-Based Farming Alerts & Action Cards */}
      <div className="space-y-4 text-left">
        <h4 className="font-extrabold text-lg text-gray-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Farming Alerts & Recommended Actions
        </h4>

        {alerts.length > 0 ? (
          alerts.map((alert, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-3xl border border-gray-200/50 dark:border-gray-800/30 space-y-3 relative">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider ${getSeverityBadge(alert.severity)}`}>
                    {alert.severity} PRIORITY
                  </span>
                  <h5 className="font-bold text-base text-gray-900 dark:text-white">{alert.title}</h5>
                </div>
                <span className="text-[10px] font-bold text-gray-400">Crop: {alert.crop}</span>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{alert.message}</p>

              {/* Action List */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800/50">
                <span className="text-[10px] font-extrabold uppercase tracking-wide text-green-600 dark:text-green-400 block mb-2">Recommended Actions:</span>
                <ul className="space-y-1.5">
                  {alert.recommendedActions.map((act, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-200">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-emerald-500 flex-shrink-0" />
            <div>
              <h5 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">Optimal Weather Conditions</h5>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">No severe weather risks detected for your plot. Proceed with regular farm routines.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherAlertsWidget;
