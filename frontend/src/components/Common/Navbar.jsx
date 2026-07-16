import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Bell, User, LogOut, Shield, Settings, Menu, CloudSun } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../services/api';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [weatherSnippet, setWeatherSnippet] = useState(null);
  
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Fetch notifications and mock weather
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const notifRes = await API.get('/notifications');
          if (notifRes.data.success) {
            setNotifications(notifRes.data.data);
          }
        }
      } catch (err) {
        console.error('Navbar fetch error:', err);
      }
    };

    fetchData();
    // Simulate real-time sensor weather for the navbar
    const weatherConditions = ['Clear Sky', 'Scattered Clouds', 'Light Rain', 'Overcast'];
    const temp = Math.floor(24 + Math.random() * 12);
    const cond = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    setWeatherSnippet({ temp, cond });

    // Poll notifications every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Close menus on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationRead = async (id) => {
    try {
      const res = await API.put(`/notifications/${id}/read`);
      if (res.data.success) {
        setNotifications(prev =>
          prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-gray-200/50 dark:border-gray-800/30 px-4 py-3 flex justify-between items-center transition-colors duration-300">
      {/* Mobile Toggle & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-green-500 to-emerald-600 p-2 rounded-xl text-white shadow-md">
            <CloudSun className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-300 bg-clip-text text-transparent hidden sm:inline-block">
            SmartAgri AI
          </span>
        </Link>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-4">
        {/* Weather Snippet */}
        {weatherSnippet && user && user.profile && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-50/50 dark:bg-green-950/20 text-green-700 dark:text-green-400 text-xs font-semibold border border-green-100/50 dark:border-green-900/30">
            <CloudSun className="h-4 w-4 animate-bounce-slow" />
            <span>{user.profile.village || 'My Farm'}: {weatherSnippet.temp}°C, {weatherSnippet.cond}</span>
          </div>
        )}

        <ThemeToggle />

        {/* Notifications Dropdown */}
        {user && (
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 relative transition-colors duration-200"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 border border-white dark:border-gray-950 rounded-full"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 max-h-96 overflow-y-auto glass-panel rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
                  <h4 className="font-bold text-sm">Notifications</h4>
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                    {unreadCount} Unread
                  </span>
                </div>
                {notifications.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-6">No notifications yet.</p>
                ) : (
                  <div className="space-y-2">
                    {notifications.map((n) => (
                      <div
                        key={n._id}
                        onClick={() => !n.isRead && handleNotificationRead(n._id)}
                        className={`p-2.5 rounded-xl text-left cursor-pointer transition-all duration-200 border ${
                          n.isRead
                            ? 'bg-transparent border-transparent'
                            : 'bg-green-50/30 dark:bg-green-950/10 border-green-100/50 dark:border-green-900/30'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-1">
                          <h5 className={`text-xs font-bold ${n.isRead ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                            {n.title}
                          </h5>
                          {!n.isRead && <span className="h-1.5 w-1.5 bg-green-500 rounded-full mt-1 flex-shrink-0"></span>}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1">{n.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* User Account Menu */}
        {user ? (
          <div className="relative flex items-center" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none"
            >
              <img
                src={user.profile?.photoUrl || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Farmer'}
                alt="Avatar"
                className="h-8 w-8 rounded-full border-2 border-green-500 bg-white"
              />
              <span className="text-xs font-semibold hidden md:inline text-gray-700 dark:text-gray-300">
                {user.profile?.name || 'Farmer'}
              </span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 top-full w-56 glass-panel rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                  <p className="text-xs font-bold truncate">{user.profile?.name}</p>
                  <p className="text-[10px] text-gray-500 truncate mt-0.5">{user.email}</p>
                  <span className="inline-block text-[9px] font-bold bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 px-2 py-0.5 rounded mt-1.5 uppercase tracking-wide">
                    {user.role}
                  </span>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-xl"
                >
                  <User className="h-4 w-4" />
                  <span>My Profile Badge</span>
                </Link>

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-xl"
                  >
                    <Shield className="h-4 w-4 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Admin Panel</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout();
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl mt-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all duration-200"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
