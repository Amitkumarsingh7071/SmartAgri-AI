import React, { useState } from 'react';
import { uploadImageAPI } from '../../services/aiApi';
import { Upload, AlertCircle, AlertTriangle, ShieldCheck, CheckCircle2, FlaskConical } from 'lucide-react';

const DiseaseDetectUpload = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setError('');
    setResult(null);
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please choose a leaf photo first.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResult(null);
      
      const res = await uploadImageAPI(file);
      setResult(res);
    } catch (err) {
      console.error(err);
      setError('AI service connection failed. Please ensure the Python FastAPI microservice is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
      {/* Upload Column (5 cols) */}
      <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/30">
        <h3 className="font-extrabold text-lg mb-1 flex items-center gap-2">
          <Upload className="h-5 w-5 text-green-500" />
          Plant Disease Diagnosis
        </h3>
        <p className="text-xs text-gray-500 mb-6">Upload a clear photo of an infected leaf to diagnose pathogen symptoms and view treatments.</p>

        <form onSubmit={handleUpload} className="space-y-4">
          {/* Preview Box */}
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
              <AlertCircle className="h-4.5 w-4.5" />
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

      {/* Results Column (7 cols) */}
      <div className="lg:col-span-7">
        {result ? (
          <div className="glass-panel p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/30 space-y-5 animate-in fade-in duration-300">
            {/* Header & Confidence */}
            <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800/50 pb-4">
              <div>
                <span className="text-[9px] font-extrabold uppercase text-gray-400 block tracking-wide">Diagnosis Result</span>
                <h4 className="font-extrabold text-lg text-gray-900 dark:text-white mt-1 flex items-center gap-2">
                  {result.disease_name.includes('Healthy') ? (
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                  {result.disease_name}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 font-bold block">Confidence</span>
                <span className="text-lg font-extrabold text-green-600 dark:text-green-400">{result.confidence}%</span>
              </div>
            </div>

            {/* Causes */}
            <div>
              <span className="text-gray-400 uppercase tracking-wide text-[9px] font-bold block">Root Causes</span>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">{result.causes}</p>
            </div>

            {/* Treatments: Organic vs Chemical */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Organic */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/10">
                <span className="text-emerald-700 dark:text-emerald-400 uppercase tracking-wide text-[9px] font-bold flex items-center gap-1.5 mb-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  Organic Treatment
                </span>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {result.treatment.organic}
                </p>
              </div>

              {/* Chemical */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/10">
                <span className="text-indigo-700 dark:text-indigo-400 uppercase tracking-wide text-[9px] font-bold flex items-center gap-1.5 mb-1.5">
                  <FlaskConical className="h-4 w-4" />
                  Chemical Treatment
                </span>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {result.treatment.chemical}
                </p>
              </div>
            </div>

            {/* Preventive Measures */}
            <div className="pt-2">
              <span className="text-gray-400 uppercase tracking-wide text-[9px] font-bold block">Preventive Measures</span>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">{result.preventive_measures}</p>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-12 rounded-3xl border border-gray-200/50 dark:border-gray-800/30 flex flex-col justify-center items-center text-center h-full min-h-[350px]">
            <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800/50 text-gray-400 mb-4 animate-pulse">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h4 className="font-bold text-sm text-gray-400">Awaiting Diagnoses Photo</h4>
            <p className="text-[11px] text-gray-500 mt-1 max-w-[240px]">Upload a photo of crop foliage leaf spots to generate diagnostic treatments and advice.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseDetectUpload;
