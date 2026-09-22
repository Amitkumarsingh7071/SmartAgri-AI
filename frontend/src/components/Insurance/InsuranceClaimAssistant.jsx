import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { ShieldCheck, FileText, Download, AlertTriangle, CheckCircle, PlusCircle, Clock } from 'lucide-react';

const InsuranceClaimAssistant = () => {
  const [claims, setClaims] = useState([]);
  const [cropName, setCropName] = useState('Tomato');
  const [damageReason, setDamageReason] = useState('HEAVY_RAIN');
  const [damagedArea, setDamagedArea] = useState('1.5');
  const [lossAmount, setLossAmount] = useState('45000');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setFetching(true);
      const res = await API.get('/insurance/claims');
      if (res.data.success) {
        setClaims(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching claims:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    if (!lossAmount || Number(lossAmount) <= 0) {
      setError('Please enter a valid estimated financial loss amount.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccessMsg('');

      const res = await API.post('/insurance/claim', {
        cropName,
        damageReason,
        damagedAreaAcres: Number(damagedArea),
        estimatedLossAmount: Number(lossAmount)
      });

      if (res.data.success) {
        setSuccessMsg(`Official PMFBY claim generated under Policy ${res.data.data.policyNumber}`);
        fetchClaims();
      }
    } catch (err) {
      console.error('Submit claim error:', err);
      setError('Failed to submit insurance claim.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = (claimId, policyNumber) => {
    const token = localStorage.getItem('token');
    const url = `http://localhost:5000/api/insurance/claim-pdf/${claimId}`;
    
    // Create temporary link element for direct download with token header or window open
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.blob())
    .then(blob => {
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `PMFBY-Claim-${policyNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch(err => console.error('PDF download error:', err));
  };

  return (
    <div className="space-y-8 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/30 space-y-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wide text-green-600 dark:text-green-400">PMFBY Government Subsidy Portal</span>
            <h3 className="font-extrabold text-xl text-gray-900 dark:text-white flex items-center gap-2 mt-0.5">
              <ShieldCheck className="h-6 w-6 text-green-500" />
              PMFBY Crop Loss Claim Assistant
            </h3>
            <p className="text-xs text-gray-500 mt-1">Auto-compile official PMFBY loss claims for weather damages and disease outbreaks.</p>
          </div>

          <form onSubmit={handleSubmitClaim} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Damaged Crop</label>
              <select
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white"
              >
                <option value="Tomato">Tomato</option>
                <option value="Wheat">Wheat</option>
                <option value="Cotton">Cotton</option>
                <option value="Rice">Rice</option>
                <option value="Maize">Maize</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Damage Event Cause</label>
              <select
                value={damageReason}
                onChange={(e) => setDamageReason(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white"
              >
                <option value="HEAVY_RAIN">🌧️ Heavy Rainfall & Waterlogging</option>
                <option value="FLOOD">🌊 Flood Damage</option>
                <option value="DISEASE">🐛 Severe Pathogen Disease Outbreak</option>
                <option value="DROUGHT">☀️ Heat Stress & Drought</option>
                <option value="HAILSTORM">❄️ Severe Hailstorm</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Affected Area (Acres)</label>
                <input
                  type="number"
                  step="0.1"
                  value={damagedArea}
                  onChange={(e) => setDamagedArea(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Estimated Loss (₹)</label>
                <input
                  type="number"
                  value={lossAmount}
                  onChange={(e) => setLossAmount(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {error && <div className="text-xs text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-xl">{error}</div>}
            {successMsg && <div className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-xl font-bold">{successMsg}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition-all"
            >
              {loading ? 'Compiling Claim...' : 'Generate & Submit PMFBY Claim'}
            </button>
          </form>
        </div>

        {/* Claims List Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h4 className="font-extrabold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-500" />
            Submitted PMFBY Claims & Official PDF Downloads
          </h4>

          {fetching ? (
            <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
          ) : claims.length > 0 ? (
            <div className="space-y-3">
              {claims.map((claim) => (
                <div key={claim._id} className="glass-panel p-5 rounded-3xl border border-gray-200/50 dark:border-gray-800/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-green-600 dark:text-green-400">{claim.policyNumber}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 uppercase">
                        {claim.claimStatus}
                      </span>
                    </div>
                    <h5 className="font-extrabold text-base text-gray-900 dark:text-white">
                      {claim.cropName} — Loss: ₹{claim.estimatedLossAmount.toLocaleString('en-IN')}
                    </h5>
                    <p className="text-xs text-gray-500">Event: {claim.damageReason} • Area: {claim.damagedAreaAcres} Acres</p>
                  </div>

                  <button
                    onClick={() => handleDownloadPdf(claim._id, claim.policyNumber)}
                    className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex-shrink-0"
                  >
                    <Download className="h-4 w-4" /> Download Claim PDF
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-gray-500 bg-gray-50 dark:bg-gray-800/20 rounded-2xl">
              No insurance claims submitted yet. Fill the form to auto-compile PMFBY claim PDFs.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsuranceClaimAssistant;
