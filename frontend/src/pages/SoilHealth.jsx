import React, { useState, useEffect } from 'react';
import API from '../services/api';
import SoilCard from '../components/Soil/SoilCard';
import { HeartPulse, Plus, Loader2, HelpCircle, AlertCircle } from 'lucide-react';

const SoilHealth = () => {
  const [records, setRecords] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [farmId, setFarmId] = useState('');
  const [N, setN] = useState('');
  const [P, setP] = useState('');
  const [K, setK] = useState('');
  const [pH, setPh] = useState('');
  const [organicCarbon, setOrganicCarbon] = useState('');
  const [moisture, setMoisture] = useState('');

  useEffect(() => {
    fetchRecordsAndFarms();
  }, []);

  const fetchRecordsAndFarms = async () => {
    try {
      setLoading(true);
      const [recordsRes, farmsRes] = await Promise.all([
        API.get('/soil'),
        API.get('/farms')
      ]);
      if (recordsRes.data.success) setRecords(recordsRes.data.data);
      if (farmsRes.data.success) setFarms(farmsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    if (!farmId || !N || !P || !K || !pH || !organicCarbon || !moisture) {
      alert('Please fill in all soil parameters.');
      return;
    }

    try {
      const payload = {
        farmId,
        N: Number(N),
        P: Number(P),
        K: Number(K),
        pH: Number(pH),
        organicCarbon: Number(organicCarbon),
        moisture: Number(moisture)
      };

      const res = await API.post('/soil', payload);
      if (res.data.success) {
        fetchRecordsAndFarms();
        setShowAddForm(false);
        setN('');
        setP('');
        setK('');
        setPh('');
        setOrganicCarbon('');
        setMoisture('');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to log soil details.');
    }
  };

  const handleDeleteRecord = async (id) => {
    if (!window.confirm('Delete this soil diagnostic log? This cannot be undone.')) return;
    try {
      const res = await API.delete(`/soil/${id}`);
      if (res.data.success) {
        setRecords(prev => prev.filter(r => r._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold flex items-center gap-2">
            <HeartPulse className="h-5.5 w-5.5 text-green-500" />
            Soil Quality Monitoring
          </h2>
          <p className="text-xs text-gray-500">Record chemical telemetry values (NPK, pH, carbon) and compile Soil Health Cards.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Log Soil Sample</span>
        </button>
      </div>

      {showAddForm && (
        <div className="glass-panel p-6 rounded-3xl border border-green-200 dark:border-green-900/50 glow-green max-w-xl animate-in slide-in-from-top-4 duration-300">
          <h3 className="font-extrabold text-sm mb-4 text-green-700 dark:text-green-400">Log Chemistry Sample</h3>
          <form onSubmit={handleAddRecord} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Farm Plot *</label>
                <select
                  required
                  value={farmId}
                  onChange={(e) => setFarmId(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">-- Choose Farm --</option>
                  {farms.map(f => (
                    <option key={f._id} value={f._id}>{f.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Soil Acidity (pH) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. 6.8"
                  value={pH}
                  onChange={(e) => setPh(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Nitrogen (N) ppm *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 140"
                  value={N}
                  onChange={(e) => setN(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Phosphorus (P) ppm *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 45"
                  value={P}
                  onChange={(e) => setP(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Potassium (K) ppm *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 210"
                  value={K}
                  onChange={(e) => setK(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Organic Carbon (%) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 0.75"
                  value={organicCarbon}
                  onChange={(e) => setOrganicCarbon(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Moisture Percentage (%) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 45"
                  value={moisture}
                  onChange={(e) => setMoisture(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-md"
              >
                Log Diagnostics
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

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
        </div>
      ) : records.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center border border-gray-200/50 dark:border-gray-800/30 max-w-xl">
          <HelpCircle className="h-12 w-12 text-gray-300 mx-auto" />
          <h4 className="font-bold text-sm text-gray-400 mt-4">No Soil Records Logged</h4>
          <p className="text-xs text-gray-500 mt-1.5">Map a new soil chemistry analysis by clicking the button in the top right.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map(rec => (
            <SoilCard
              key={rec._id}
              record={rec}
              onDelete={handleDeleteRecord}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SoilHealth;
