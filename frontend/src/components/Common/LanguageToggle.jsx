import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe, ChevronDown } from 'lucide-react';

const languages = [
  { code: 'en', label: 'English', native: 'English', flag: '🌐' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', flag: '🚩' }
];

const LanguageToggle = () => {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = languages.find(l => l.code === language) || languages[0];

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200 focus:outline-none"
        title="Select Language / भाषा चुनें"
      >
        <Globe className="h-4 w-4 text-green-600 dark:text-green-400" />
        <span>{currentLang.native}</span>
        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 glass-panel rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-2 py-1 border-b border-gray-100 dark:border-gray-800 mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Language</span>
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                changeLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`flex items-center justify-between w-full px-3 py-2 text-xs rounded-xl transition-all duration-150 ${
                language === lang.code
                  ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 dark:text-green-400 font-bold border border-green-500/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.native}</span>
              </span>
              <span className="text-[10px] text-gray-400 font-normal">({lang.code.toUpperCase()})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;
