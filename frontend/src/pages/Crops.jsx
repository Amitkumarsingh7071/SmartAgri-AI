import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Sprout, Plus, Trash2, Milestone, Calendar, Loader2, HelpCircle, CheckSquare } from 'lucide-react';

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Crop Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [farmId, setFarmId] = useState('');
  const [name, setName] = useState('');
  const [variety, setVariety] = useState('');
  const [stage, setStage] = useState('Sowing');
  const [expectedHarvestDate, setExpectedHarvestDate] = useState('');

  // Growth Stage Updates
  const [editingCropId, setEditingCropId] = useState('');
  const [updateStage, setUpdateStage] = useState('Sowing');
  const [stageNotes, setStageNotes] = useState('');

  useEffect(() => {
    fetchCropsAndFarms();
  }, []);

  const fetchCropsAndFarms = async () => {
    try {
      setLoading(true);
      const [cropsRes, farmsRes] = await Promise.all([
        API.get('/crops'),
        API.get('/farms')
      ]);
      if (cropsRes.data.success) setCrops(cropsRes.data.data);
      if (farmsRes.data.success) setFarms(farmsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCrop = async (e) => {
    e.preventDefault();
    if (!farmId || !name || !expectedHarvestDate) {
      alert('Please fill in required crop metadata.');
      return;
    }

    try {
      const payload = {
        farmId,
        name,
        variety,
        stage,
        expectedHarvestDate
      };
      const res = await API.post('/crops', payload);
      if (res.data.success) {
        // Refetch to populate farm details correctly
        fetchCropsAndFarms();
        setShowAddForm(false);
        setName('');
        setVariety('');
        setExpectedHarvestDate('');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to plant crop.');
    }
  };

  const handleUpdateStage = async (cropId) => {
    try {
      const res = await API.put(`/crops/${cropId}`, {
        stage: updateStage,
        notes: stageNotes
      });
      if (res.data.success) {
        fetchCropsAndFarms();
        setEditingCropId('');
        setStageNotes('');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update stage.');
    }
  };

  const handleDeleteCrop = async (id) => {
    if (!window.confirm('Delete this crop monitoring cycle? This will delete its growth stage timeline.')) return;
    try {
      const res = await API.delete(`/crops/${id}`);
      if (res.data.success) {
        setCrops(prev => prev.filter(c => c._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const activeCrops = crops.filter(c => c.stage !== 'Harvested');
  const harvestedCrops = crops.filter(c => c.stage === 'Harvested');

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold flex items-center gap-2">
            <Sprout className="h-5.5 w-5.5 text-green-500" />
            Active Crop Cycles
          </h2>
          <p className="text-xs text-gray-500">Monitor active crops growth milestones and review previous cycles.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Plant New Crop</span>
        </button>
      </div>

      {showAddForm && (
        <div className="glass-panel p-6 rounded-3xl border border-green-200 dark:border-green-900/50 glow-green max-w-xl animate-in slide-in-from-top-4 duration-300">
          <h3 className="font-extrabold text-sm mb-4 text-green-700 dark:text-green-400">Register Sown Crop</h3>
          <form onSubmit={handleAddCrop} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Target Farm Plot *</label>
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
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Crop Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wheat, Rice, Cotton"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Variety</label>
                <input
                  type="text"
                  placeholder="e.g. Kalyan Sona"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Initial Growth Stage</label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Sowing">Sowing</option>
                  <option value="Vegetative">Vegetative</option>
                  <option value="Flowering">Flowering</option>
                  <option value="Maturity">Maturity</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Exp Harvest Date *</label>
                <input
                  type="date"
                  required
                  value={expectedHarvestDate}
                  onChange={(e) => setExpectedHarvestDate(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-md"
              >
                Log Planting Sowing
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
      ) : (
        <div className="space-y-10">
          {/* Active crops monitoring section */}
          <div>
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-400 mb-4">Currently Growing</h3>
            {activeCrops.length === 0 ? (
              <div className="glass-panel p-10 rounded-3xl text-center border border-gray-200/50 dark:border-gray-800/30">
                <HelpCircle className="h-10 w-10 text-gray-300 mx-auto" />
                <h4 className="font-bold text-sm text-gray-400 mt-3">No Active Crops</h4>
                <p className="text-[11px] text-gray-500 mt-1">Register a newly sown seed using the button in the top right.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeCrops.map(c => (
                  <div key={c._id} className="glass-panel p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/30 text-left space-y-4">
                    <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-3">
                      <div>
                        <h4 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
                          <Sprout className="h-5 w-5 text-green-500" />
                          {c.name}
                        </h4>
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          Plot: {c.farmId?.name || 'N/A'} | Variety: {c.variety || 'Standard'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteCrop(c._id)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Delete cycle"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Milestone Growth Stages */}
                    <div>
                      <span className="text-gray-400 uppercase tracking-wide text-[9px] font-bold block mb-2">Growth Stage Timeline</span>
                      <div className="flex justify-between gap-1">
                        {['Sowing', 'Vegetative', 'Flowering', 'Maturity'].map((st, i) => {
                          const stagesList = ['Sowing', 'Vegetative', 'Flowering', 'Maturity'];
                          const currentIdx = stagesList.indexOf(c.stage);
                          const stIdx = stagesList.indexOf(st);
                          const isPassed = stIdx <= currentIdx;
                          const isActive = st === c.stage;

                          return (
                            <div key={st} className="flex flex-col items-center flex-1">
                              <div className={`h-1.5 w-full rounded-full ${
                                isActive ? 'bg-green-500 animate-pulse' : isPassed ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-800'
                              }`}></div>
                              <span className={`text-[9px] mt-1.5 font-bold ${
                                isActive ? 'text-green-500' : isPassed ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'
                              }`}>{st}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="flex justify-between text-[10px] bg-gray-50/50 dark:bg-gray-800/10 p-3 rounded-2xl border border-gray-100/50 dark:border-gray-850/40">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        <div>
                          <span className="text-gray-400 block font-semibold uppercase">Planted</span>
                          <span className="font-bold">{new Date(c.plantedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Milestone className="h-3.5 w-3.5 text-emerald-500" />
                        <div>
                          <span className="text-gray-400 block font-semibold uppercase">Exp Harvest</span>
                          <span className="font-bold">{new Date(c.expectedHarvestDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stage updating interface */}
                    <div className="pt-2 border-t border-gray-150 dark:border-gray-800">
                      {editingCropId === c._id ? (
                        <div className="space-y-3 animate-in fade-in duration-200 text-xs">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] text-gray-400 font-bold uppercase mb-0.5">New Stage</label>
                              <select
                                value={updateStage}
                                onChange={(e) => setUpdateStage(e.target.value)}
                                className="w-full p-2 rounded-lg glass-input outline-none"
                              >
                                <option value="Sowing">Sowing</option>
                                <option value="Vegetative">Vegetative</option>
                                <option value="Flowering">Flowering</option>
                                <option value="Maturity">Maturity</option>
                                <option value="Harvested">Harvested (Archive)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[9px] text-gray-400 font-bold uppercase mb-0.5">Activity Notes</label>
                              <input
                                type="text"
                                placeholder="e.g. Applied Urea dose"
                                value={stageNotes}
                                onChange={(e) => setStageNotes(e.target.value)}
                                className="w-full p-2 rounded-lg glass-input outline-none"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateStage(c._id)}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold text-[10px] py-2 rounded-lg"
                            >
                              Confirm Stage Transition
                            </button>
                            <button
                              onClick={() => setEditingCropId('')}
                              className="px-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-[10px] py-2 rounded-lg"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingCropId(c._id);
                            setUpdateStage(c.stage);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 border border-green-200 dark:border-green-900/40 text-green-700 dark:text-green-400 font-bold text-xs rounded-xl hover:bg-green-50/20 dark:hover:bg-green-950/20 transition-all"
                        >
                          <CheckSquare className="h-4 w-4" />
                          <span>Update Growth Stage</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Historical harvested section */}
          {harvestedCrops.length > 0 && (
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-400 mb-4">Crop Harvest History</h3>
              <div className="glass-panel rounded-2xl border border-gray-200/50 dark:border-gray-800/30 overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-gray-800/10 text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-2">
                      <th className="p-4 font-bold">Crop</th>
                      <th className="p-4 font-bold">Farm Plot</th>
                      <th className="p-4 font-bold">Planted Date</th>
                      <th className="p-4 font-bold">Harvested Date</th>
                      <th className="p-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/50 dark:divide-gray-800/20">
                    {harvestedCrops.map(h => (
                      <tr key={h._id} className="hover:bg-gray-50/30 dark:hover:bg-gray-800/10">
                        <td className="p-4 font-bold text-gray-800 dark:text-gray-200">
                          {h.name} <span className="text-[10px] text-gray-400 font-normal">({h.variety})</span>
                        </td>
                        <td className="p-4 text-gray-500">{h.farmId?.name || 'N/A'}</td>
                        <td className="p-4 text-gray-500">{new Date(h.plantedDate).toLocaleDateString()}</td>
                        <td className="p-4 text-gray-500">{h.harvestDate ? new Date(h.harvestDate).toLocaleDateString() : 'N/A'}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 text-[9px] bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-full font-bold">
                            Successfully Harvested
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Crops;
