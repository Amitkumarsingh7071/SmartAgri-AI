import React, { useState, useEffect } from 'react';
import API from '../services/api';
import InteractiveMap from '../components/Maps/InteractiveMap';
import { Map, Plus, Trash2, Landmark, HelpCircle, Compass, Droplet, Sprout, Loader2 } from 'lucide-react';

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [activeFarm, setActiveFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add Farm form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [area, setArea] = useState('');
  const [soilType, setSoilType] = useState('Loamy');
  const [waterSource, setWaterSource] = useState('Tubewell');

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      setLoading(true);
      const res = await API.get('/farms');
      if (res.data.success) {
        setFarms(res.data.data);
        if (res.data.data.length > 0) {
          setActiveFarm(res.data.data[0]);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load farms.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFarm = async (e) => {
    e.preventDefault();
    if (!name || !location || !area || !latitude || !longitude) {
      alert('Please fill in all coordinates and dimensions.');
      return;
    }

    try {
      const payload = {
        name,
        location,
        latitude: Number(latitude),
        longitude: Number(longitude),
        area: Number(area),
        soilType,
        waterSource
      };

      const res = await API.post('/farms', payload);
      if (res.data.success) {
        setFarms(prev => [...prev, res.data.data]);
        setActiveFarm(res.data.data);
        
        // Reset form
        setName('');
        setLocation('');
        setLatitude('');
        setLongitude('');
        setArea('');
        setShowAddForm(false);
      }
    } catch (err) {
      console.error(err);
      alert('Error creating farm.');
    }
  };

  const handleDeleteFarm = async (id, e) => {
    e.stopPropagation(); // Avoid triggering card selection
    if (!window.confirm('Are you sure you want to delete this farm? This will clear its mapping coordinate history.')) return;

    try {
      const res = await API.delete(`/farms/${id}`);
      if (res.data.success) {
        setFarms(prev => prev.filter(f => f._id !== id));
        if (activeFarm && activeFarm._id === id) {
          setActiveFarm(farms.find(f => f._id !== id) || null);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting farm.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold flex items-center gap-2">
            <Map className="h-5.5 w-5.5 text-green-500" />
            Land Holdings Map
          </h2>
          <p className="text-xs text-gray-500">Register land plots with GPS coordinates and overlay them on openstreetmap layers.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Register Farm Plot</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Farm list and Register form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {showAddForm && (
            <div className="glass-panel p-6 rounded-3xl border border-green-200 dark:border-green-900/50 glow-green animate-in slide-in-from-top-4 duration-300">
              <h3 className="font-extrabold text-sm mb-4 text-green-700 dark:text-green-400">Register Land Details</h3>
              <form onSubmit={handleAddFarm} className="space-y-3.5">
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Farm Plot Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rampur Wheat Sector 2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Village / State Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rampur, Karnal, Haryana"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Latitude Coordinate</label>
                    <input
                      type="number"
                      step="0.000001"
                      required
                      placeholder="e.g. 29.6857"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Longitude Coordinate</label>
                    <input
                      type="number"
                      step="0.000001"
                      required
                      placeholder="e.g. 76.9905"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Area Size (Acres)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="e.g. 3.5"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Soil Type</label>
                    <select
                      value={soilType}
                      onChange={(e) => setSoilType(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Alluvial Soil">Alluvial Soil</option>
                      <option value="Black Soil">Black Soil</option>
                      <option value="Red Soil">Red Soil</option>
                      <option value="Loamy">Loamy</option>
                      <option value="Sandy">Sandy</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Water Source</label>
                    <select
                      value={waterSource}
                      onChange={(e) => setWaterSource(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Tubewell">Tubewell</option>
                      <option value="Drip Irrigation">Drip Irrigation</option>
                      <option value="Rainfed">Rainfed</option>
                      <option value="Canal">Canal</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-md"
                  >
                    Save Plot Coordinates
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs py-2.5 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Farm Cards List */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
            </div>
          ) : farms.length === 0 ? (
            <div className="glass-panel p-10 rounded-3xl text-center border border-gray-200/50 dark:border-gray-800/30">
              <HelpCircle className="h-10 w-10 text-gray-300 mx-auto" />
              <h4 className="font-bold text-sm text-gray-400 mt-3">No Farms Registered</h4>
              <p className="text-[11px] text-gray-500 mt-1">Click the button in the top right to map your first land holding.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {farms.map(f => {
                const isActive = activeFarm && activeFarm._id === f._id;
                return (
                  <div
                    key={f._id}
                    onClick={() => setActiveFarm(f)}
                    className={`glass-panel p-5 rounded-2xl border text-left cursor-pointer transition-all duration-200 relative overflow-hidden ${
                      isActive
                        ? 'border-green-500 dark:border-green-400 shadow-md ring-1 ring-green-500/20'
                        : 'border-gray-200/50 dark:border-gray-800/20 hover:border-gray-300'
                    }`}
                  >
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500"></div>}
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">{f.name}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">{f.location}</p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteFarm(f._id, e)}
                        className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
                        title="Delete coordinates"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800/40 pt-3">
                      <div className="flex items-center gap-1.5">
                        <Compass className="h-3.5 w-3.5 text-green-500" />
                        <span>{f.area} Acres</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Droplet className="h-3.5 w-3.5 text-blue-500" />
                        <span>{f.waterSource}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Sprout className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="truncate">{f.currentCrop || 'Fallow'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Leaflet Map (7 cols) */}
        <div className="lg:col-span-7 sticky top-24">
          <InteractiveMap farms={farms} activeFarm={activeFarm} />
          
          {activeFarm && (
            <div className="glass-panel p-5 rounded-2xl border border-gray-200/50 dark:border-gray-800/30 text-left mt-6 animate-in fade-in duration-300">
              <span className="text-[9px] font-extrabold uppercase text-green-600 dark:text-green-400 block tracking-wider">Active Selection Coordinates</span>
              <div className="flex justify-between items-center mt-2.5">
                <div>
                  <h4 className="font-extrabold text-sm">{activeFarm.name}</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">GPS: {activeFarm.latitude.toFixed(5)}, {activeFarm.longitude.toFixed(5)}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">Soil Classification</span>
                  <span className="text-xs font-extrabold text-gray-700 dark:text-gray-300">{activeFarm.soilType}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Farms;
