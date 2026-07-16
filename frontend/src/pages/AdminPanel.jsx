import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { ShieldAlert, Users, Landmark, FileDown, Send, Plus, Loader2, ArrowRight } from 'lucide-react';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Broadcast Notification Form State
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMsg, setNotifMsg] = useState('');
  const [notifType, setNotifType] = useState('general');
  const [notifLoading, setNotifLoading] = useState(false);

  // Create Government Scheme Form State
  const [schemeTitle, setSchemeTitle] = useState('');
  const [schemeDesc, setSchemeDesc] = useState('');
  const [schemeDept, setSchemeDept] = useState('');
  const [schemeBenefit, setSchemeBenefit] = useState('');
  const [schemeMinAge, setSchemeMinAge] = useState('18');
  const [schemeMaxFarm, setSchemeMaxFarm] = useState('');
  const [schemeStateLimit, setSchemeStateLimit] = useState('');
  const [schemeLink, setSchemeLink] = useState('');
  const [schemeLoading, setSchemeLoading] = useState(false);

  // Update Mandi Prices Form State
  const [priceCrop, setPriceCrop] = useState('Wheat');
  const [priceMarket, setPriceMarket] = useState('');
  const [priceState, setPriceState] = useState('');
  const [priceVal, setPriceVal] = useState('');
  const [priceLoading, setPriceLoading] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, farmersRes] = await Promise.all([
        API.get('/admin/dashboard-stats'),
        API.get('/admin/farmers')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (farmersRes.data.success) setFarmers(farmersRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!notifTitle || !notifMsg) return;

    try {
      setNotifLoading(true);
      const res = await API.post('/admin/notifications', {
        title: notifTitle,
        message: notifMsg,
        type: notifType
      });
      if (res.data.success) {
        alert('Alert broadcasted to all farmer dashboard headers successfully.');
        setNotifTitle('');
        setNotifMsg('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setNotifLoading(false);
    }
  };

  const handleCreateScheme = async (e) => {
    e.preventDefault();
    if (!schemeTitle || !schemeDesc || !schemeDept || !schemeBenefit) return;

    try {
      setSchemeLoading(true);
      const payload = {
        title: schemeTitle,
        description: schemeDesc,
        department: schemeDept,
        benefit: schemeBenefit,
        minAge: Number(schemeMinAge),
        maxFarmSize: schemeMaxFarm ? Number(schemeMaxFarm) : undefined,
        states: schemeStateLimit ? [schemeStateLimit] : [],
        link: schemeLink
      };

      const res = await API.post('/admin/schemes', payload);
      if (res.data.success) {
        alert('Government scheme published successfully.');
        setSchemeTitle('');
        setSchemeDesc('');
        setSchemeDept('');
        setSchemeBenefit('');
        setSchemeMaxFarm('');
        setSchemeStateLimit('');
        setSchemeLink('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSchemeLoading(false);
    }
  };

  const handleUpdatePrice = async (e) => {
    e.preventDefault();
    if (!priceMarket || !priceState || !priceVal) return;

    try {
      setPriceLoading(true);
      const res = await API.post('/admin/prices', {
        crop: priceCrop,
        market: priceMarket,
        state: priceState,
        price: Number(priceVal)
      });
      if (res.data.success) {
        alert('Mandi price updated successfully.');
        setPriceMarket('');
        setPriceState('');
        setPriceVal('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPriceLoading(false);
    }
  };

  const handleExportCSV = (reportType) => {
    // Open CSV download endpoint in new window/tab
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/admin/reports/${reportType}?Authorization=Bearer ${token}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="h-10 w-10 text-green-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-left">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold flex items-center gap-2">
          <ShieldAlert className="h-5.5 w-5.5 text-green-500 animate-pulse" />
          Administrator Security Console
        </h2>
        <p className="text-xs text-gray-500 font-medium">Global database diagnostics, broadcasts, subsidy publishes, and CSV report tools.</p>
      </div>

      {/* Stats Dash */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/30">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Farmers database</span>
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white block mt-1">{stats.counters.totalFarmers} Active</span>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/30">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Mapped Plots</span>
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white block mt-1">{stats.counters.totalFarms} Plots</span>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/30">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Total Area Size</span>
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white block mt-1">{stats.counters.totalArea} Acres</span>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/30">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Global Cashflow</span>
            <span className={`text-2xl font-extrabold block mt-1 ${stats.finances.profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              ₹{stats.finances.profit}
            </span>
          </div>
        </div>
      )}

      {/* CSV Reports & Broadcast notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CSV & Broadcast forms (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* CSV Download card */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/30">
            <h3 className="font-extrabold text-sm mb-4 flex items-center gap-2">
              <FileDown className="h-4.5 w-4.5 text-green-500" />
              Download Database Records (CSV Format)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleExportCSV('farmers')}
                className="p-3 bg-gray-50/50 dark:bg-gray-850/10 hover:bg-gray-100/50 dark:hover:bg-gray-850/20 border border-gray-250 dark:border-gray-800 rounded-xl text-xs font-semibold flex justify-between items-center transition-colors"
              >
                <span>Farmers Roster</span>
                <FileDown className="h-4 w-4 text-green-500" />
              </button>
              <button
                onClick={() => handleExportCSV('farms')}
                className="p-3 bg-gray-50/50 dark:bg-gray-850/10 hover:bg-gray-100/50 dark:hover:bg-gray-850/20 border border-gray-250 dark:border-gray-800 rounded-xl text-xs font-semibold flex justify-between items-center transition-colors"
              >
                <span>Farms Directory</span>
                <FileDown className="h-4 w-4 text-green-500" />
              </button>
              <button
                onClick={() => handleExportCSV('soil')}
                className="p-3 bg-gray-50/50 dark:bg-gray-850/10 hover:bg-gray-100/50 dark:hover:bg-gray-850/20 border border-gray-250 dark:border-gray-800 rounded-xl text-xs font-semibold flex justify-between items-center transition-colors"
              >
                <span>Soil Telemetry</span>
                <FileDown className="h-4 w-4 text-green-500" />
              </button>
            </div>
          </div>

          {/* Broadcast alert */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/30">
            <h3 className="font-extrabold text-sm mb-4 flex items-center gap-2">
              <Send className="h-4.5 w-4.5 text-green-500" />
              Broadcast Dashboard Notification
            </h3>
            <form onSubmit={handleBroadcast} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Notification Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Heavy Rain Alert"
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl glass-input outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Alert Type</label>
                  <select
                    value={notifType}
                    onChange={(e) => setNotifType(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl glass-input outline-none"
                  >
                    <option value="general">General</option>
                    <option value="weather">Weather Alert</option>
                    <option value="mandi">Mandi Market Alert</option>
                    <option value="scheme">Scheme Update</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Alert Message Body</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thunderstorms predicted. Cover grain stocks."
                  value={notifMsg}
                  onChange={(e) => setNotifMsg(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl glass-input outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={notifLoading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-md"
              >
                {notifLoading ? 'Broadcasting...' : 'Publish Notification Alert'}
              </button>
            </form>
          </div>
        </div>

        {/* Schemes and Mandi forms (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Publish schemes */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/30">
            <h3 className="font-extrabold text-sm mb-4 flex items-center gap-2">
              <Plus className="h-4.5 w-4.5 text-green-500" />
              Publish Government Scheme
            </h3>
            <form onSubmit={handleCreateScheme} className="space-y-3.5">
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Scheme Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PM Kisan Nidhi"
                  value={schemeTitle}
                  onChange={(e) => setSchemeTitle(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl glass-input outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Department</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Min of Agriculture"
                    value={schemeDept}
                    onChange={(e) => setSchemeDept(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl glass-input outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Welfare Benefit</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹6,000 per year"
                    value={schemeBenefit}
                    onChange={(e) => setSchemeBenefit(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl glass-input outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Eligibility criteria description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Up to 60% Seed discounts for farmers"
                  value={schemeDesc}
                  onChange={(e) => setSchemeDesc(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl glass-input outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Max Farm Size (Acres limit)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5 (Leave blank for no limit)"
                    value={schemeMaxFarm}
                    onChange={(e) => setSchemeMaxFarm(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl glass-input outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">State restriction</label>
                  <input
                    type="text"
                    placeholder="e.g. Gujarat (Blank for all)"
                    value={schemeStateLimit}
                    onChange={(e) => setSchemeStateLimit(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl glass-input outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Official Portal Link</label>
                <input
                  type="url"
                  placeholder="e.g. https://pmkisan.gov.in"
                  value={schemeLink}
                  onChange={(e) => setSchemeLink(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl glass-input outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={schemeLoading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-md"
              >
                {schemeLoading ? 'Publishing...' : 'Publish Scheme'}
              </button>
            </form>
          </div>

          {/* Update Mandi prices */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/30">
            <h3 className="font-extrabold text-sm mb-4 flex items-center gap-2">
              <Plus className="h-4.5 w-4.5 text-green-500" />
              Update Mandi Market Price
            </h3>
            <form onSubmit={handleUpdatePrice} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Select Crop</label>
                  <select
                    value={priceCrop}
                    onChange={(e) => setPriceCrop(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl glass-input outline-none"
                  >
                    <option value="Wheat">Wheat</option>
                    <option value="Rice">Rice</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Sugarcane">Sugarcane</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Potato">Potato</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Market Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Karnal Mandi"
                    value={priceMarket}
                    onChange={(e) => setPriceMarket(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl glass-input outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">State</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Haryana"
                    value={priceState}
                    onChange={(e) => setPriceState(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl glass-input outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Price/Quintal (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 2150"
                    value={priceVal}
                    onChange={(e) => setPriceVal(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl glass-input outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={priceLoading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-md"
              >
                {priceLoading ? 'Updating...' : 'Publish Rate'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
