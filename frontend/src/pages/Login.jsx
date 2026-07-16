import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please provide both email and password.');
      setLoading(false);
      return;
    }

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  // Quick Autofill helper
  const handleQuickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-tr from-green-500/20 via-transparent to-emerald-600/10">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/30 text-left shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600"></div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-300 bg-clip-text text-transparent inline-block">
            Sign In
          </h2>
          <p className="text-xs text-gray-500 mt-1">Smart Agriculture & Farmer Database Management System</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 text-xs bg-red-50 dark:bg-red-950/20 text-red-500 p-3 rounded-xl">
            <ShieldAlert className="h-4.5 w-4.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ramesh@farm.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[10px] text-gray-400 font-bold uppercase">Password</label>
              <button
                type="button"
                onClick={() => alert("Simulation: Click one of the quick autofill buttons below to log in immediately.")}
                className="text-[10px] text-green-600 dark:text-green-400 hover:underline font-bold"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-extrabold text-sm py-3 rounded-xl shadow-lg transition-all duration-200"
          >
            {loading ? 'Validating credentials...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials Section (Premium helper) */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800/40">
          <span className="text-[9px] text-gray-400 font-bold block uppercase mb-3 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-yellow-500" /> Quick Sandbox Sign-In
          </span>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleQuickLogin('ramesh@farm.com')}
              className="w-full text-left text-xs p-2.5 rounded-xl border border-green-100 dark:border-green-900/30 hover:bg-green-50/20 dark:hover:bg-green-950/20 transition-all flex justify-between items-center"
            >
              <div>
                <span className="font-bold text-gray-800 dark:text-gray-200">Ramesh Kumar</span>
                <span className="text-[10px] text-gray-400 block">Farmer (Karnal, Haryana)</span>
              </div>
              <span className="text-[10px] bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-2 py-0.5 rounded font-extrabold uppercase">Farmer A</span>
            </button>

            <button
              onClick={() => handleQuickLogin('suresh@farm.com')}
              className="w-full text-left text-xs p-2.5 rounded-xl border border-green-100 dark:border-green-900/30 hover:bg-green-50/20 dark:hover:bg-green-950/20 transition-all flex justify-between items-center"
            >
              <div>
                <span className="font-bold text-gray-800 dark:text-gray-200">Suresh Patel</span>
                <span className="text-[10px] text-gray-400 block">Farmer (Anand, Gujarat)</span>
              </div>
              <span className="text-[10px] bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-2 py-0.5 rounded font-extrabold uppercase">Farmer B</span>
            </button>

            <button
              onClick={() => handleQuickLogin('admin@smartagri.com')}
              className="w-full text-left text-xs p-2.5 rounded-xl border border-emerald-200 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 transition-all flex justify-between items-center"
            >
              <div>
                <span className="font-bold text-gray-800 dark:text-gray-200">System Admin</span>
                <span className="text-[10px] text-gray-400 block">All-access dashboards</span>
              </div>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded font-extrabold uppercase">Admin</span>
            </button>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-gray-500">
          New user?{' '}
          <Link to="/register" className="text-green-600 dark:text-green-400 hover:underline font-bold">
            Create Profile Badge
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
