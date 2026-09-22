import React from 'react';
import SmartAgriVoice from '../components/Voice/SmartAgriVoice';
import { Mic, Info } from 'lucide-react';

const VoiceAssistantPage = () => {
  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* Top Farmer Explanation Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-green-700 text-white shadow-lg relative overflow-hidden">
        <div className="flex items-start gap-3 relative z-10">
          <Info className="h-6 w-6 text-green-200 mt-0.5 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-extrabold">🎤 Multilingual Voice Assistant Guide</h2>
            <p className="text-xs text-green-100 mt-1 leading-relaxed">
              Tap the microphone or choose your language (<strong>English, हिंदी, मराठी</strong>). Speak your query naturally—such as 
              <em> "माझ्या पिकाला कोणता खत द्यावा?"</em>. SmartAgri will answer using your actual plot and crop details.
            </p>
          </div>
        </div>
      </div>

      <SmartAgriVoice />
    </div>
  );
};

export default VoiceAssistantPage;
