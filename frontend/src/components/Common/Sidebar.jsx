import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  LayoutDashboard,
  Map,
  Sprout,
  HeartPulse,
  TrendingUp,
  Award,
  Cpu,
  User,
  Shield,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const links = [
    { name: t('menu.dashboard'), path: '/', icon: LayoutDashboard },
    { name: t('menu.farms'), path: '/farms', icon: Map },
    { name: t('menu.crops'), path: '/crops', icon: Sprout },
    { name: t('menu.soilHealth'), path: '/soil', icon: HeartPulse },
    { name: t('menu.finance'), path: '/finance', icon: TrendingUp },
    { name: t('menu.schemes'), path: '/schemes', icon: Award },
    { name: t('menu.aiStudio'), path: '/ai-studio', icon: Cpu },
    { name: t('menu.profile'), path: '/profile', icon: User },
  ];

  if (user && user.role === 'admin') {
    links.push({ name: t('menu.admin'), path: '/admin', icon: Shield });
  }

  const activeStyle = "flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/10 text-green-700 dark:text-green-400 border-l-4 border-green-500 font-semibold rounded-r-xl transition-all duration-200";
  const inactiveStyle = "flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/40 hover:text-gray-900 dark:hover:text-gray-100 rounded-xl transition-all duration-200 mx-2";

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
        ></div>
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 glass-panel border-r border-gray-200/50 dark:border-gray-800/30 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header (Mobile Close Button) */}
        <div className="flex justify-between items-center p-4 lg:hidden border-b border-gray-200/50 dark:border-gray-800/30">
          <span className="font-bold text-sm">Navigation Menu</span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Brand logo if needed on side */}
        <div className="hidden lg:flex items-center gap-2 p-6 border-b border-gray-100/50 dark:border-gray-800/20">
          <div className="bg-gradient-to-tr from-green-500 to-emerald-600 p-2 rounded-xl text-white shadow-md">
            <Sprout className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-green-700 to-emerald-600 dark:from-green-400 dark:to-emerald-300 bg-clip-text text-transparent">
            SmartAgri Database
          </span>
        </div>

        {/* Links Navigation */}
        <nav className="flex-1 space-y-1.5 py-6 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) =>
                  isActive ? activeStyle : inactiveStyle
                }
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="p-4 border-t border-gray-100/50 dark:border-gray-800/20 text-center text-[10px] text-gray-500">
          <p>© 2026 Smart Agriculture</p>
          <p className="mt-1 font-medium text-green-600 dark:text-green-400">PWA Offline Supported</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
