import React from 'react';
import InsuranceClaimAssistant from '../components/Insurance/InsuranceClaimAssistant';
import { ShieldCheck, Info } from 'lucide-react';

const CropInsurancePage = () => {
  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* Top Farmer Explanation Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-600 to-yellow-700 text-white shadow-lg relative overflow-hidden">
        <div className="flex items-start gap-3 relative z-10">
          <Info className="h-6 w-6 text-amber-200 mt-0.5 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-extrabold">📄 PMFBY Crop Loss Insurance Claims Guide</h2>
            <p className="text-xs text-amber-100 mt-1 leading-relaxed">
              If your plot suffered damage from heavy rain, flooding, or disease, select your crop and cause below. 
              Click <strong>"Generate Claim"</strong> to auto-compile an official government PMFBY claim PDF for insurance inspection.
            </p>
          </div>
        </div>
      </div>

      <InsuranceClaimAssistant />
    </div>
  );
};

export default CropInsurancePage;
