import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Award, CheckCircle, XCircle, Search, HelpCircle, ExternalLink, ShieldCheck } from 'lucide-react';

const Schemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [eligibilityData, setEligibilityData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [checking, setChecking] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const res = await API.get('/schemes');
      if (res.data.success) {
        setSchemes(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckEligibility = async () => {
    try {
      setChecking(true);
      const res = await API.post('/schemes/check-eligibility');
      if (res.data.success) {
        setEligibilityData(res.data.data);
        setHasChecked(true);
      }
    } catch (err) {
      console.error(err);
      alert('Could not verify eligibility. Complete your profile details first.');
    } finally {
      setChecking(false);
    }
  };

  const filteredSchemes = schemes.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-left">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold flex items-center gap-2">
            <Award className="h-5.5 w-5.5 text-green-500" />
            Government Welfare Schemes
          </h2>
          <p className="text-xs text-gray-500">Search national agricultural subsidies, crop insurance programs, and loan schemes.</p>
        </div>
        <button
          onClick={handleCheckEligibility}
          disabled={checking}
          className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold text-xs rounded-xl shadow-md transition-all"
        >
          <ShieldCheck className="h-4.5 w-4.5" />
          <span>{checking ? 'Analyzing Profile...' : 'Verify My Eligibility'}</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search schemes (e.g. Kisan, Drip)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl glass-input focus:ring-2 focus:ring-green-500 outline-none transition-all"
        />
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSchemes.map(s => {
          // If checked, find this scheme's suitability logs
          const match = eligibilityData.find(e => e.schemeId === s._id);
          const isEligible = match ? match.isEligible : null;

          return (
            <div
              key={s._id}
              className={`glass-panel p-6 rounded-3xl border flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 relative overflow-hidden ${
                isEligible === true
                  ? 'border-emerald-500 dark:border-emerald-500/40 bg-emerald-50/10'
                  : isEligible === false
                  ? 'border-red-400 dark:border-red-900/40 bg-red-50/5'
                  : 'border-gray-200/50 dark:border-gray-800/20'
              }`}
            >
              {/* Badge info */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[9px] bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 px-2.5 py-0.5 rounded font-bold uppercase block tracking-wider w-max">
                    {s.department.split(' ')[0]}
                  </span>
                  <h4 className="font-extrabold text-sm text-gray-900 dark:text-white mt-2">{s.title}</h4>
                </div>
                {isEligible === true && (
                  <span className="flex items-center gap-1 text-emerald-600 text-[10px] font-extrabold uppercase bg-emerald-100/60 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                    <CheckCircle className="h-3.5 w-3.5" /> Eligible
                  </span>
                )}
                {isEligible === false && (
                  <span className="flex items-center gap-1 text-red-600 text-[10px] font-extrabold uppercase bg-red-100/60 dark:bg-red-950/40 px-2 py-0.5 rounded-full">
                    <XCircle className="h-3.5 w-3.5" /> Ineligible
                  </span>
                )}
              </div>

              <div className="space-y-3 my-4">
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{s.description}</p>
                <div className="flex justify-between text-[11px] font-bold py-2 border-t border-b border-gray-100 dark:border-gray-800/40">
                  <span className="text-gray-400">Scheme Benefit:</span>
                  <span className="text-green-600 dark:text-green-400">{s.benefit}</span>
                </div>

                {/* Eligibility requirements or check failures */}
                {hasChecked && match && (
                  <div className="p-3 rounded-xl text-[10px] bg-gray-50/50 dark:bg-gray-800/10 border border-gray-100 dark:border-gray-850/45">
                    <span className="text-gray-400 uppercase font-bold block mb-1">Eligibility Diagnostics</span>
                    <ul className="space-y-1">
                      {match.reasons.map((r, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className={isEligible ? 'text-emerald-500' : 'text-red-500'}>•</span>
                          <span className={isEligible ? 'text-emerald-600' : 'text-red-500'}>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action link */}
              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] text-gray-400">Active State: {s.eligibility?.states.join(', ') || 'All India'}</span>
                {s.link && (
                  <a
                    href={s.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 hover:underline"
                  >
                    <span>Apply Official Portal</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Schemes;
