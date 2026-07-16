import React, { useState } from 'react';
import { Download, AlertCircle, CheckCircle, FileSpreadsheet } from 'lucide-react';
import API from '../../services/api';

const SoilCard = ({ record, onDelete }) => {
  const [downloading, setDownloading] = useState(false);

  const getStatusColor = (val, min, max) => {
    if (val < min) return 'text-red-500 bg-red-50 dark:bg-red-950/20';
    if (val > max) return 'text-amber-500 bg-amber-50 dark:bg-amber-950/20';
    return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20';
  };

  const getStatusText = (val, min, max, label = '') => {
    if (val < min) return 'Deficient';
    if (val > max) return 'Excessive';
    return 'Optimal';
  };

  const getProgressWidth = (val, maxLimit) => {
    return `${Math.min((val / maxLimit) * 100, 100)}%`;
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      // Fetch binary PDF data from backend and download it
      const response = await API.get(`/soil/${record._id}/card`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `Soil_Health_Card_${record._id.substring(0, 8).toUpperCase()}.pdf`;
      link.click();
    } catch (err) {
      console.error('PDF download error:', err);
      alert('Failed to generate PDF. Make sure server is running.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/30 flex flex-col justify-between shadow-lg relative overflow-hidden transition-transform duration-200 hover:-translate-y-1">
      {/* Card Ribbon */}
      <div className="absolute top-0 right-0 h-2 w-full bg-gradient-to-r from-green-400 to-emerald-500"></div>

      <div>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-extrabold text-sm text-gray-900 dark:text-gray-100">
              {record.farmId?.name || 'My Farm Plot'}
            </h4>
            <span className="text-[10px] text-gray-400 block mt-0.5">
              Tested: {new Date(record.recordedAt).toLocaleDateString()}
            </span>
          </div>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 rounded-xl shadow-sm transition-colors duration-150"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{downloading ? 'Generating...' : 'PDF Card'}</span>
          </button>
        </div>

        {/* NPK Parameters */}
        <div className="space-y-3.5 my-5">
          {/* N */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-gray-500">Nitrogen (N)</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold">{record.N} ppm</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold uppercase ${getStatusColor(record.N, 120, 240)}`}>
                  {getStatusText(record.N, 120, 240)}
                </span>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${record.N < 120 ? 'bg-red-500' : record.N > 240 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: getProgressWidth(record.N, 300) }}
              ></div>
            </div>
          </div>

          {/* P */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-gray-500">Phosphorus (P)</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold">{record.P} ppm</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold uppercase ${getStatusColor(record.P, 30, 60)}`}>
                  {getStatusText(record.P, 30, 60)}
                </span>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${record.P < 30 ? 'bg-red-500' : record.P > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: getProgressWidth(record.P, 100) }}
              ></div>
            </div>
          </div>

          {/* K */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-gray-500">Potassium (K)</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold">{record.K} ppm</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold uppercase ${getStatusColor(record.K, 150, 300)}`}>
                  {getStatusText(record.K, 150, 300)}
                </span>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${record.K < 150 ? 'bg-red-500' : record.K > 300 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: getProgressWidth(record.K, 400) }}
              ></div>
            </div>
          </div>
        </div>

        {/* Supplementary telemetry (pH, moisture, carbon) */}
        <div className="grid grid-cols-3 gap-2 text-center border-t border-gray-100 dark:border-gray-800/50 pt-4 mt-4">
          <div className="p-1 rounded-xl bg-gray-50/50 dark:bg-gray-800/10">
            <span className="text-[9px] text-gray-400 block font-bold uppercase">pH Acidity</span>
            <span className={`text-xs font-bold ${record.pH < 6.0 ? 'text-red-500' : record.pH > 7.5 ? 'text-amber-500' : 'text-emerald-500'}`}>
              {record.pH}
            </span>
          </div>
          <div className="p-1 rounded-xl bg-gray-50/50 dark:bg-gray-800/10">
            <span className="text-[9px] text-gray-400 block font-bold uppercase">Carbon</span>
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
              {record.organicCarbon}%
            </span>
          </div>
          <div className="p-1 rounded-xl bg-gray-50/50 dark:bg-gray-800/10">
            <span className="text-[9px] text-gray-400 block font-bold uppercase">Moisture</span>
            <span className="text-xs font-bold text-blue-500">
              {record.moisture}%
            </span>
          </div>
        </div>
      </div>

      {/* Delete Option */}
      {onDelete && (
        <div className="mt-4 pt-3 flex justify-end">
          <button
            onClick={() => onDelete(record._id)}
            className="text-[10px] text-red-500 hover:text-red-700 hover:underline font-semibold"
          >
            Delete Record
          </button>
        </div>
      )}
    </div>
  );
};

export default SoilCard;
