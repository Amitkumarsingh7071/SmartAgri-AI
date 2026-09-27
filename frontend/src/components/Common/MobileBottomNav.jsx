import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Sprout, Activity, Mic, User } from 'lucide-react';

const MobileBottomNav = () => {
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'My Farm', path: '/farms', icon: Sprout },
    { name: 'Monitor', path: '/ai-studio', icon: Activity },
    { name: 'Voice', path: '/voice-assistant', icon: Mic },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 shadow-lg">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-semibold transition ${
                  isActive
                    ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
