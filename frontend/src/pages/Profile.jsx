import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Phone, MapPin, Landmark, Award, Shield, FileSignature, Download } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  // Form fields
  const [name, setName] = useState(user?.profile?.name || '');
  const [phone, setPhone] = useState(user?.profile?.phone || '');
  const [age, setAge] = useState(user?.profile?.age || '');
  const [village, setVillage] = useState(user?.profile?.village || '');
  const [district, setDistrict] = useState(user?.profile?.district || '');
  const [state, setState] = useState(user?.profile?.state || '');
  const [farmSize, setFarmSize] = useState(user?.profile?.farmSize || '');
  const [soilType, setSoilType] = useState(user?.profile?.soilType || 'Loamy');
  const [irrigationType, setIrrigationType] = useState(user?.profile?.irrigationType || 'Tubewell');
  const [experience, setExperience] = useState(user?.profile?.experience || '');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setLoading(true);

    const payload = {
      name,
      phone,
      age: Number(age),
      village,
      district,
      state,
      farmSize: Number(farmSize),
      soilType,
      irrigationType,
      experience: Number(experience)
    };

    if (password) {
      payload.password = password;
    }

    const res = await updateProfile(payload);
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Profile badge updated successfully.');
      setPassword('');
    } else {
      alert(res.message);
    }
  };

  const downloadQR = () => {
    if (!user?.profile?.qrCode) return;
    const link = document.createElement('a');
    link.href = user.profile.qrCode;
    link.download = `Farmer_Badge_${user.profile.farmerId}.png`;
    link.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left animate-in fade-in duration-300">
      {/* Profile Form (7 cols) */}
      <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/30">
        <h2 className="text-xl font-extrabold mb-1 flex items-center gap-2">
          <User className="h-5.5 w-5.5 text-green-500" />
          Edit Profile Information
        </h2>
        <p className="text-xs text-gray-500 mb-6">Modify details to re-compile your PWA farmer credentials badge and update scheme matching criteria.</p>

        {successMsg && (
          <div className="mb-6 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
            <Shield className="h-4.5 w-4.5" />
            {successMsg}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Phone</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Village</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {user?.role === 'farmer' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-t border-gray-100 dark:border-gray-800/40 pt-4">
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Farm Size (Acres)</label>
                <input
                  type="number"
                  value={farmSize}
                  onChange={(e) => setFarmSize(e.target.value)}
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
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Irrigation Type</label>
                <select
                  value={irrigationType}
                  onChange={(e) => setIrrigationType(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Tubewell">Tubewell</option>
                  <option value="Drip Irrigation">Drip Irrigation</option>
                  <option value="Rainfed">Rainfed</option>
                  <option value="Canal">Canal</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Exp (Years)</label>
                <input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 dark:border-gray-800/40 pt-4">
            <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Update Password (Leave blank to keep current)</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full md:w-1/2 p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-max px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition-all"
          >
            {loading ? 'Re-compiling profile...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>

      {/* QR Code ID Card Display (5 cols) */}
      <div className="lg:col-span-5 h-full">
        {user && (
          <div className="glass-panel p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/30 text-center relative overflow-hidden bg-gradient-to-b from-gray-50/50 via-transparent to-transparent dark:from-gray-900/10 shadow-xl max-w-sm mx-auto">
            {/* Header Badge */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-1.5 text-left">
                <Landmark className="h-4.5 w-4.5 text-green-600 dark:text-green-400" />
                <div>
                  <span className="text-[10px] font-extrabold text-gray-900 dark:text-white uppercase leading-none block">SMART AGRI CARD</span>
                  <span className="text-[8px] text-gray-400 leading-none block">Ministry of Agriculture</span>
                </div>
              </div>
              <span className="text-[8px] bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 px-2 py-0.5 rounded font-extrabold uppercase">
                {user.role}
              </span>
            </div>

            {/* Profile Avatar */}
            <img
              src={user.profile?.photoUrl || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ramesh'}
              alt="Farmer photo"
              className="h-24 w-24 rounded-full border-4 border-green-500 bg-white mx-auto shadow-md mb-4"
            />

            {/* Profile metadata */}
            <div className="space-y-1 mb-6">
              <h3 className="font-extrabold text-lg text-gray-950 dark:text-white">{user.profile?.name}</h3>
              <span className="text-[10px] text-gray-400 block font-semibold">{user.profile?.farmerId}</span>
              <span className="text-xs text-gray-500 block">
                {user.profile?.village}, {user.profile?.district}, {user.profile?.state}
              </span>
            </div>

            {/* QR Code Container */}
            {user.profile?.qrCode && (
              <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-inner w-44 h-44 mx-auto mb-6 flex justify-center items-center">
                <img src={user.profile.qrCode} alt="Scan QR Code" className="w-full h-full" />
              </div>
            )}

            <button
              onClick={downloadQR}
              className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl transition-all"
            >
              <Download className="h-4.5 w-4.5" />
              <span>Download Digital ID Card</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
