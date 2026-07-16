import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, Phone, User, Landmark, MapPin, Sprout, ShieldAlert } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // State fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [soilType, setSoilType] = useState('Alluvial Soil');
  const [irrigationType, setIrrigationType] = useState('Tubewell');
  const [experience, setExperience] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password || !name || !phone) {
      setError('Please fill in all required fields (Name, Email, Password, Phone).');
      setLoading(false);
      return;
    }

    const payload = {
      email,
      password,
      role,
      name,
      age: age ? Number(age) : undefined,
      phone,
      address,
      village,
      district,
      state,
      farmSize: farmSize ? Number(farmSize) : undefined,
      soilType: role === 'farmer' ? soilType : undefined,
      irrigationType: role === 'farmer' ? irrigationType : undefined,
      experience: experience ? Number(experience) : undefined
    };

    const res = await register(payload);
    setLoading(false);

    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-tr from-green-500/20 via-transparent to-emerald-600/10">
      <div className="w-full max-w-2xl glass-panel p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/30 text-left shadow-2xl relative overflow-hidden my-6">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600"></div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-300 bg-clip-text text-transparent inline-block">
            Create System Account
          </h2>
          <p className="text-xs text-gray-500 mt-1">Smart Agriculture & Farmer Database Management System</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 text-xs bg-red-50 dark:bg-red-950/20 text-red-500 p-3 rounded-xl">
            <ShieldAlert className="h-4.5 w-4.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Account Credentials */}
          <div>
            <h4 className="font-bold text-xs text-green-600 dark:text-green-400 uppercase tracking-wider mb-3">1. Login Credentials</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@gmail.com"
                  className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Password *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">User Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="farmer">Farmer (Land owner)</option>
                  <option value="admin">System Admin</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Contact Info */}
          <div className="border-t border-gray-100 dark:border-gray-800/40 pt-4">
            <h4 className="font-bold text-xs text-green-600 dark:text-green-400 uppercase tracking-wider mb-3">2. Profile Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ramesh Kumar"
                  className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 42"
                  className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Geographical Address */}
          <div className="border-t border-gray-100 dark:border-gray-800/40 pt-4">
            <h4 className="font-bold text-xs text-green-600 dark:text-green-400 uppercase tracking-wider mb-3">3. Location Info</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House 14, Main Road"
                  className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Village</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="Rampur"
                  className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">District / State</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Karnal"
                    className="w-1/2 p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Haryana"
                    className="w-1/2 p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Soil parameters (Only visible/applicable for farmer) */}
          {role === 'farmer' && (
            <div className="border-t border-gray-100 dark:border-gray-800/40 pt-4 animate-in fade-in duration-300">
              <h4 className="font-bold text-xs text-green-600 dark:text-green-400 uppercase tracking-wider mb-3">4. Soil & Farm Configuration</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Farm Size (Acres)</label>
                  <input
                    type="number"
                    value={farmSize}
                    onChange={(e) => setFarmSize(e.target.value)}
                    placeholder="e.g. 5.5"
                    className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Soil Type</label>
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
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Irrigation Type</label>
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
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 15"
                    className="w-full p-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg transition-all duration-200"
          >
            {loading ? 'Creating account...' : 'Create Account & Generate PWA Badge'}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-gray-500">
          Already registered?{' '}
          <Link to="/login" className="text-green-600 dark:text-green-400 hover:underline font-bold">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
