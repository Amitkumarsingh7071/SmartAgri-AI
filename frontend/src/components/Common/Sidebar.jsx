import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  MapPin,
  Sprout,
  Activity,
  DollarSign,
  CloudSun,
  Map,
  TrendingUp,
  Award,
  Mic,
  Cpu,
  User,
  Shield,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const categories = [
    {
      title: 'HOME',
      links: [
        { name: 'Farmer Dashboard', path: '/', icon: LayoutDashboard }
      ]
    },
    {
      title: 'MY FARM',
      links: [
        { name: 'My Farms & Plots', path: '/farms', icon: MapPin },
        { name: 'Crop Register', path: '/crops', icon: Sprout },
        { name: 'Soil Health Cards', path: '/soil', icon: Activity },
        { name: 'Farm Finances', path: '/finance', icon: DollarSign }
      ]
    },
    {
      title: 'MONITOR',
      links: [
        { name: 'Disease Diagnostics', path: '/ai-studio', icon: Cpu },
        { name: 'Weather Intelligence', path: '/weather-alerts', icon: CloudSun },
        { name: 'Satellite NDVI Map', path: '/satellite-ndvi', icon: Map }
      ]
    },
    {
      title: 'PLAN & MARKET',
      links: [
        { name: 'Fertilizer & Chemical Rates', path: '/input-prices', icon: DollarSign },
        { name: '30-Day Mandi Forecast', path: '/price-predictor', icon: TrendingUp },
        { name: 'PMFBY Insurance Claims', path: '/crop-insurance', icon: Award },
        { name: 'Government Schemes', path: '/schemes', icon: Award }
      ]
    },
    {
      title: 'ASSISTANT',
      links: [
        { name: 'Ask SmartAgri Voice', path: '/voice-assistant', icon: Mic },
        { name: 'AI Farming Assistant', path: '/ai-studio', icon: Cpu }
      ]
    }
  ];

  if (user && user.role === 'admin') {
    categories.push({
      title: 'ADMINISTRATION',
      links: [
        { name: 'Admin & ML Console', path: '/admin', icon: Shield }
      ]
    });
  }

  const activeStyle = "flex items-center gap-3 px-3.5 py-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold text-xs rounded-xl border-l-4 border-emerald-600 transition";
  const inactiveStyle = "flex items-center gap-3 px-3.5 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 text-xs font-semibold rounded-xl transition";

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        ></div>
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Logo */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-700 p-2 rounded-xl text-white shadow-xs">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-base text-slate-900 dark:text-white block leading-tight">
                SmartAgri AI
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Farmer Decision Platform</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Grouped Category Links */}
        <nav className="flex-1 space-y-6 p-4 overflow-y-auto">
          {categories.map((cat, idx) => (
            <div key={idx}>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3.5 mb-2 block">
                {cat.title}
              </span>
              <div className="space-y-1">
                {cat.links.map((link, lIdx) => {
                  const Icon = link.icon;
                  return (
                    <NavLink
                      key={lIdx}
                      to={link.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        isActive ? activeStyle : inactiveStyle
                      }
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span>{link.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Account Quick Link */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <NavLink
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <User className="h-4 w-4 text-emerald-600" />
            <div className="text-left overflow-hidden">
              <span className="text-xs font-bold text-slate-800 dark:text-white block truncate">
                {user?.profile?.name || 'Farmer Account'}
              </span>
              <span className="text-[10px] text-slate-400 block truncate">{user?.email || 'Settings & QR ID'}</span>
            </div>
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
