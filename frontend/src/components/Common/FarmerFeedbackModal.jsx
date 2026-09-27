import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle, MessageSquare } from 'lucide-react';

const FarmerFeedbackModal = ({ cropName = "Tomato", diagnosisOrRec = "Tomato Early Blight", onClose }) => {
  const [wasHelpful, setWasHelpful] = useState(true);
  const [correct, setCorrect] = useState('YES');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/farmer-features/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature_type: 'disease_detection',
          diagnosis_or_rec: diagnosisOrRec,
          was_helpful: wasHelpful,
          diagnosis_correct: correct,
          comments,
          crop_name: cropName
        })
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Feedback submit error:", err);
    }
  };

  return (
    <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              Was this diagnosis & treatment guidance helpful?
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWasHelpful(true)}
                className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition ${wasHelpful ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'}`}
              >
                <ThumbsUp className="w-3.5 h-3.5" /> Yes
              </button>

              <button
                type="button"
                onClick={() => setWasHelpful(false)}
                className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition ${!wasHelpful ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-slate-600 border-slate-200'}`}
              >
                <ThumbsDown className="w-3.5 h-3.5" /> No
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-600 font-semibold">Diagnosis Accuracy:</span>
            {['YES', 'NO', 'UNSURE'].map(opt => (
              <label key={opt} className="flex items-center gap-1 text-slate-700 font-medium cursor-pointer">
                <input 
                  type="radio" 
                  name="correct" 
                  value={opt} 
                  checked={correct === opt} 
                  onChange={() => setCorrect(opt)} 
                />
                {opt}
              </label>
            ))}
          </div>

          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Optional farmer comments or field feedback..."
              value={comments}
              onChange={e => setComments(e.target.value)}
              className="w-full text-xs p-2 border border-slate-200 rounded-lg outline-none bg-white"
            />
            <button 
              type="submit"
              className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition whitespace-nowrap"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold py-1">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          Thank you! Your feedback helps improve model real-world reliability.
        </div>
      )}
    </div>
  );
};

export default FarmerFeedbackModal;
