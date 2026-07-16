import React, { useState, useEffect } from 'react';
import { Sun, CloudRain, CloudSun, Wind, Droplets, Sunrise, Sunset, CloudLightning } from 'lucide-react';

const WeatherWidget = ({ location }) => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    // Generate realistic, state-based mock weather forecasts to show high-fidelity data
    const isGujarat = location?.toLowerCase().includes('gujarat') || location?.toLowerCase().includes('anand');
    const city = isGujarat ? 'Anand, Gujarat' : 'Karnal, Haryana';
    
    // Simulate data
    const baseTemp = isGujarat ? 35 : 28; // Gujarat is warmer in July
    
    const mock = {
      city,
      temp: baseTemp,
      humidity: isGujarat ? 65 : 82,
      windSpeed: isGujarat ? 12 : 18,
      condition: isGujarat ? 'Scattered Clouds' : 'Light Rain Showers',
      rainRisk: isGujarat ? 30 : 85,
      sunrise: isGujarat ? '05:58 AM' : '05:32 AM',
      sunset: isGujarat ? '07:15 PM' : '07:24 PM',
      forecast: [
        { day: 'Today', temp: baseTemp, icon: isGujarat ? CloudSun : CloudRain, rainRisk: isGujarat ? 30 : 85 },
        { day: 'Tomorrow', temp: baseTemp - 1, icon: isGujarat ? Sun : CloudLightning, rainRisk: isGujarat ? 15 : 90 },
        { day: 'Sat', temp: baseTemp + 1, icon: Sun, rainRisk: 10 },
        { day: 'Sun', temp: baseTemp + 2, icon: Sun, rainRisk: 5 },
        { day: 'Mon', temp: baseTemp, icon: CloudSun, rainRisk: 25 },
        { day: 'Tue', temp: isGujarat ? baseTemp - 2 : baseTemp - 3, icon: CloudRain, rainRisk: isGujarat ? 60 : 80 },
        { day: 'Wed', temp: baseTemp - 1, icon: isGujarat ? CloudSun : CloudRain, rainRisk: isGujarat ? 40 : 70 },
      ]
    };
    
    setWeatherData(mock);
  }, [location]);

  if (!weatherData) return null;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/30 flex flex-col justify-between h-full">
      {/* Current Weather Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-extrabold text-lg text-gray-900 dark:text-gray-100">{weatherData.city}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{weatherData.condition}</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-extrabold block text-green-600 dark:text-green-400">{weatherData.temp}°C</span>
          <span className="text-[10px] bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-bold">
            Rain Risk: {weatherData.rainRisk}%
          </span>
        </div>
      </div>

      {/* Weather telemetry sliders */}
      <div className="grid grid-cols-2 gap-4 my-6">
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-900/10">
          <Droplets className="h-5 w-5 text-blue-500" />
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-bold">Humidity</span>
            <span className="text-sm font-extrabold text-gray-800 dark:text-gray-200">{weatherData.humidity}%</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-orange-50/50 dark:bg-orange-950/10 border border-orange-100/50 dark:border-orange-900/10">
          <Wind className="h-5 w-5 text-orange-500" />
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-bold">Wind Speed</span>
            <span className="text-sm font-extrabold text-gray-800 dark:text-gray-200">{weatherData.windSpeed} km/h</span>
          </div>
        </div>
      </div>

      {/* Sunrise & Sunset */}
      <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Sunrise className="h-4 w-4 text-amber-500" />
          <div className="text-left">
            <span className="text-[9px] text-gray-400 block uppercase font-bold">Sunrise</span>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{weatherData.sunrise}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Sunset className="h-4 w-4 text-indigo-500" />
          <div className="text-left">
            <span className="text-[9px] text-gray-400 block uppercase font-bold">Sunset</span>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{weatherData.sunset}</span>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-3 text-left">7-Day Forecast</h4>
        <div className="flex justify-between gap-1 overflow-x-auto pb-1">
          {weatherData.forecast.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="flex flex-col items-center p-2 rounded-xl bg-gray-50/40 dark:bg-gray-800/10 hover:bg-gray-100/50 dark:hover:bg-gray-800/20 border border-transparent hover:border-gray-200/50 dark:hover:border-gray-800/50 min-w-10 flex-1">
                <span className="text-[10px] text-gray-500 font-medium">{f.day}</span>
                <Icon className="h-4 w-4 text-green-600 dark:text-green-400 my-2" />
                <span className="text-xs font-bold">{f.temp}°</span>
                <span className="text-[8px] text-blue-500 mt-1 font-bold">{f.rainRisk}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
