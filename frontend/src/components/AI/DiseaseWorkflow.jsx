import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { uploadImageAPI } from '../../services/aiApi';
import { Upload, AlertCircle, AlertTriangle, ShieldCheck, CheckCircle2, FlaskConical, Calendar, ArrowRight, History, Camera, CheckSquare } from 'lucide-react';

const DiseaseWorkflow = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeReport, setActiveReport] = useState(null);
  const [reportsHistory, setReportsHistory] = useState([]);
  const [followUpFile, setFollowUpFile] = useState(null);
  const [followUpPreview, setFollowUpPreview] = useState('');
  const [comparing, setComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDiseaseReports();
  }, []);

  const fetchDiseaseReports = async () => {
    try {
      const res = await API.get('/disease-workflow/reports');
      if (res.data.success) {
        setReportsHistory(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching disease reports:', err);
    }
  };

  const handleFileChange = (e) => {
    setError('');
    setResult(null);
    setActiveReport(null);
    setComparisonResult(null);
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleAnalyzeImage = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a leaf photo first.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResult(null);

      // Call AI Microservice
      const aiResult = await uploadImageAPI(file);
      setResult(aiResult);
    } catch (err) {
      console.error(err);
      setError('AI diagnostic service unavailable. Please make sure Python FastAPI microservice is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTreatmentPlan = async () => {
    if (!result) return;

    try {
      setLoading(true);
      const res = await API.post('/disease-workflow/report', {
        cropName: 'Tomato',
        imageUrl: previewUrl || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb1626f?w=600',
        diseaseName: result.disease_name,
        confidence: result.confidence,
        severity: result.severity || 'Moderate',
        riskLevel: result.risk_level || 'MEDIUM',
        immediateActions: result.immediate_actions || []
      });

      if (res.data.success) {
        setActiveReport(res.data.data);
        fetchDiseaseReports();
      }
    } catch (err) {
      console.error('Create plan error:', err);
      setError('Failed to save treatment plan.');
    } finally {
      setLoading(false);
    }
  };

  const handleStepToggle = async (reportId, stepIndex, currentVal) => {
    try {
      const res = await API.put(`/disease-workflow/reports/${reportId}/step`, {
        stepIndex,
        completed: !currentVal
      });

      if (res.data.success) {
        setActiveReport(res.data.data);
        fetchDiseaseReports();
      }
    } catch (err) {
      console.error('Step update error:', err);
    }
  };

  const handleFollowUpFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFollowUpFile(selected);
      setFollowUpPreview(URL.createObjectURL(selected));
    }
  };

  const handleCompareFollowUp = async (reportId) => {
    if (!followUpFile) {
      setError('Please upload a follow-up image to compare.');
      return;
    }

    try {
      setComparing(true);
      setError('');

      // Analyze follow-up image with AI service
      const aiResult = await uploadImageAPI(followUpFile);

      // Compare on backend
      const res = await API.post('/disease-workflow/compare', {
        reportId,
        followUpImageUrl: followUpPreview,
        newDiseaseName: aiResult.disease_name,
        newConfidence: aiResult.confidence,
        newSeverity: aiResult.severity || 'Mild',
        notes: `Follow-up scan detected ${aiResult.disease_name}`
      });

      if (res.data.success) {
        setComparisonResult({
          status: res.data.progressionStatus,
          message: res.data.message,
          newDisease: aiResult.disease_name,
          newConfidence: aiResult.confidence,
          newSeverity: aiResult.severity || 'Mild'
        });
        setActiveReport(res.data.data);
        fetchDiseaseReports();
      }
    } catch (err) {
      console.error('Comparison error:', err);
      setError('Failed to process image comparison.');
    } finally {
      setComparing(false);
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Diagnostics Header & Upload Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload Column (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/30">
          <h3 className="font-extrabold text-lg mb-1 flex items-center gap-2 text-gray-900 dark:text-white">
            <Upload className="h-5 w-5 text-green-500" />
            Leaf Disease Diagnostic Workflow
          </h3>
          <p className="text-xs text-gray-500 mb-6">Upload a photo of crop foliage to generate diagnostic timelines, safety guides, and Before/After comparisons.</p>

          <form onSubmit={handleAnalyzeImage} className="space-y-4">
            <div className="w-full h-56 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-green-500 rounded-2xl overflow-hidden flex flex-col justify-center items-center cursor-pointer transition-colors relative bg-gray-50/20 dark:bg-gray-800/5">
              {previewUrl ? (
                <img src={previewUrl} alt="Leaf preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center p-6 text-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-3" />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Click or Drag Leaf Image</span>
                  <span className="text-[10px] text-gray-400 mt-1">Supports PNG, JPG (Max 5MB)</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs bg-red-50 dark:bg-red-950/20 text-red-500 p-3 rounded-xl">
                <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all duration-200"
            >
              <span>{loading ? 'Analyzing leaf symptoms...' : 'Run Diagnostics'}</span>
            </button>
          </form>
        </div>

        {/* Results & Actions Column (7 cols) */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="glass-panel p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/30 space-y-5">
              {/* Header & Confidence */}
              <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800/50 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider ${result.risk_level === 'HIGH' || result.risk_level === 'CRITICAL' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'}`}>
                      {result.risk_level || 'MEDIUM'} RISK
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">Severity: {result.severity || 'Moderate'}</span>
                  </div>
                  <h4 className="font-extrabold text-lg text-gray-900 dark:text-white mt-1.5 flex items-center gap-2">
                    {result.disease_name.includes('Healthy') ? (
                      <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    )}
                    {result.disease_name}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 font-bold block">AI Confidence</span>
                  <span className="text-lg font-extrabold text-green-600 dark:text-green-400">{result.confidence}%</span>
                </div>
              </div>

              {/* What Should You Do Now? */}
              <div>
                <span className="text-gray-400 uppercase tracking-wide text-[10px] font-extrabold block mb-2">What Should You Do Now?</span>
                <ul className="space-y-2">
                  {(result.immediate_actions || []).map((act, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-200 bg-gray-50/50 dark:bg-gray-800/30 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Organic vs Chemical Treatment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/10">
                  <span className="text-emerald-700 dark:text-emerald-400 uppercase tracking-wide text-[9px] font-bold flex items-center gap-1.5 mb-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    Organic Treatment
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {result.treatment?.organic}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/10">
                  <span className="text-indigo-700 dark:text-indigo-400 uppercase tracking-wide text-[9px] font-bold flex items-center gap-1.5 mb-1.5">
                    <FlaskConical className="h-4 w-4" />
                    Chemical Treatment
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {result.treatment?.chemical}
                  </p>
                </div>
              </div>

              {/* Safety Warning Disclaimer */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300 font-medium">
                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>{result.safety_disclaimer || "Always verify chemical pesticide application rates with your local Krishi Vigyan Kendra (KVK) officer before spraying."}</span>
              </div>

              {/* Create 7-Day Treatment Plan Button */}
              <button
                onClick={handleCreateTreatmentPlan}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-lg transition-all"
              >
                <Calendar className="h-4 w-4" />
                <span>Create 7-Day Interactive Treatment Plan</span>
              </button>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-3xl border border-gray-200/50 dark:border-gray-800/30 flex flex-col justify-center items-center text-center h-full min-h-[350px]">
              <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800/50 text-gray-400 mb-4 animate-pulse">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <h4 className="font-bold text-sm text-gray-400">Awaiting Leaf Scan</h4>
              <p className="text-[11px] text-gray-500 mt-1 max-w-[240px]">Upload a leaf photo to diagnose pathogens, generate treatment timelines, and track recovery progress.</p>
            </div>
          )}
        </div>
      </div>

      {/* Active Treatment Timeline Plan */}
      {activeReport && (
        <div className="glass-panel p-6 rounded-3xl border border-green-500/20 bg-green-500/5 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-200/50 dark:border-gray-800/50 pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-green-600 dark:text-green-400">Active Treatment Timeline</span>
              <h4 className="font-extrabold text-lg text-gray-900 dark:text-white mt-0.5">
                {activeReport.cropName} — {activeReport.diseaseName} ({activeReport.status})
              </h4>
            </div>
            <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-bold">
              {activeReport.treatmentPlan.filter(s => s.completed).length} / {activeReport.treatmentPlan.length} Tasks Complete
            </span>
          </div>

          {/* Timeline Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {activeReport.treatmentPlan.map((step, idx) => (
              <div
                key={idx}
                onClick={() => handleStepToggle(activeReport._id, idx, step.completed)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  step.completed 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200' 
                    : 'bg-white dark:bg-gray-900/60 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 hover:border-green-500'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-extrabold uppercase text-green-600 dark:text-green-400">{step.day}</span>
                  <CheckSquare className={`h-4 w-4 ${step.completed ? 'text-emerald-500 fill-emerald-500/20' : 'text-gray-400'}`} />
                </div>
                <p className="text-xs leading-relaxed font-medium">{step.task}</p>
              </div>
            ))}
          </div>

          {/* Follow-Up Image Upload & Before / After Comparison */}
          <div className="pt-4 border-t border-gray-200/50 dark:border-gray-800/50 space-y-4">
            <h5 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <Camera className="h-4 w-4 text-green-500" />
              Upload Follow-Up Image for Before / After Comparison
            </h5>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFollowUpFileChange}
                className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-green-500 file:text-white hover:file:bg-green-600"
              />
              <button
                onClick={() => handleCompareFollowUp(activeReport._id)}
                disabled={comparing || !followUpFile}
                className="px-5 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                {comparing ? 'Analyzing comparison...' : 'Run Image Comparison'}
              </button>
            </div>

            {/* Comparison Result Display */}
            {comparisonResult && (
              <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-black ${comparisonResult.status === 'IMPROVED' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                    {comparisonResult.message}
                  </span>
                </div>

                {/* Side by Side BEFORE vs AFTER */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-gray-400 block">BEFORE (Original Diagnosis)</span>
                    <img src={activeReport.imageUrl} alt="Before" className="h-32 w-full object-cover rounded-xl border" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">{activeReport.diseaseName}</span>
                  </div>

                  <div className="text-center space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-green-500 block">AFTER (Follow-Up Scan)</span>
                    <img src={followUpPreview} alt="After" className="h-32 w-full object-cover rounded-xl border border-green-500/50" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">{comparisonResult.newDisease} ({comparisonResult.newConfidence}%)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Disease Reports History List */}
      {reportsHistory.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/30 space-y-4">
          <h4 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
            <History className="h-5 w-5 text-green-500" />
            Previous Disease Reports & Diagnosis History
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reportsHistory.map((rep) => (
              <div
                key={rep._id}
                onClick={() => setActiveReport(rep)}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                  activeReport?._id === rep._id 
                    ? 'border-green-500 bg-green-500/10' 
                    : 'border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/30 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-gray-400">{new Date(rep.createdAt).toLocaleDateString()}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${rep.status === 'Resolved' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                    {rep.status}
                  </span>
                </div>
                <h5 className="font-bold text-sm text-gray-900 dark:text-white">{rep.cropName} — {rep.diseaseName}</h5>
                <p className="text-[11px] text-gray-500 mt-1">Severity: {rep.severity} | Confidence: {rep.confidence}%</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseWorkflow;
