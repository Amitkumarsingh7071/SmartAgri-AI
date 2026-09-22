import React, { useState, useEffect, useRef } from 'react';
import API from '../../services/api';
import { Mic, MicOff, Volume2, Square, Send, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

const SmartAgriVoice = () => {
  const [lang, setLang] = useState('en'); // 'en' | 'hi' | 'mr'
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [cropContext, setCropContext] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [error, setError] = useState('');

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    // Initialize Speech Recognition if supported by browser
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setError('');
      };

      recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        setTranscript(spokenText);
        handleSendQuery(spokenText);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setError('Microphone permission denied. Please type your query below.');
        } else {
          setError('Could not capture speech cleanly. Try again or type below.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [lang]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError('Browser speech recognition unavailable. Please use the text input below.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      stopAudio();
      setTranscript('');
      setAiResponse('');
      setError('');
      
      const langCode = lang === 'hi' ? 'hi-IN' : (lang === 'mr' ? 'mr-IN' : 'en-US');
      recognitionRef.current.lang = langCode;
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Recognition start exception:', e);
      }
    }
  };

  const handleSendQuery = async (queryText) => {
    const textToSubmit = queryText || textInput;
    if (!textToSubmit || !textToSubmit.trim()) return;

    try {
      setIsThinking(true);
      setError('');

      const res = await API.post('/voice/query', {
        speechText: textToSubmit,
        lang
      });

      if (res.data.success) {
        setAiResponse(res.data.response);
        setCropContext(res.data.context);
        speakText(res.data.response);
      }
    } catch (err) {
      console.error('Voice query error:', err);
      setError('AI assistant processing failed. Please try again.');
    } finally {
      setIsThinking(false);
    }
  };

  const speakText = (text) => {
    stopAudio();
    if (!synthRef.current) return;

    // Clean text tags before speaking
    const cleanText = text.replace(/\[.*?\]/g, '').replace(/[\*\_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === 'hi' ? 'hi-IN' : (lang === 'mr' ? 'mr-IN' : 'en-US');
    utterance.rate = 0.95;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    synthRef.current.speak(utterance);
  };

  const stopAudio = () => {
    if (synthRef.current && synthRef.current.speaking) {
      synthRef.current.cancel();
    }
    setIsPlayingAudio(false);
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/30 text-left space-y-5">
      {/* Title & Language Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wide text-green-600 dark:text-green-400">Context-Aware AI Agronomist</span>
          <h3 className="font-extrabold text-xl text-gray-900 dark:text-white flex items-center gap-2 mt-0.5">
            <Sparkles className="h-6 w-6 text-green-500" />
            🎤 Ask SmartAgri Assistant
          </h3>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-800/60 rounded-xl">
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${lang === 'en' ? 'bg-white dark:bg-gray-900 text-green-600 shadow' : 'text-gray-500'}`}
          >
            English
          </button>
          <button
            onClick={() => setLang('hi')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${lang === 'hi' ? 'bg-white dark:bg-gray-900 text-green-600 shadow' : 'text-gray-500'}`}
          >
            हिंदी
          </button>
          <button
            onClick={() => setLang('mr')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${lang === 'mr' ? 'bg-white dark:bg-gray-900 text-green-600 shadow' : 'text-gray-500'}`}
          >
            मराठी
          </button>
        </div>
      </div>

      {/* Mic Button & Status Indicator */}
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-green-500/5 to-transparent border border-green-500/10 text-center relative">
        <button
          onClick={toggleListening}
          className={`h-20 w-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse ring-8 ring-red-500/20' 
              : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white hover:scale-105'
          }`}
        >
          {isListening ? <MicOff className="h-9 w-9" /> : <Mic className="h-9 w-9" />}
        </button>

        <span className="text-xs font-extrabold mt-3 text-gray-800 dark:text-gray-200">
          {isListening 
            ? '🔴 Listening... Speak now' 
            : isThinking 
            ? '🤖 SmartAgri is thinking...' 
            : 'Tap Microphone to Speak'}
        </span>

        {/* Sample Prompt Suggestions */}
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <span className="text-[10px] text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
            {lang === 'hi' ? 'क्या आज सिंचाई करनी चाहिए?' : (lang === 'mr' ? 'आज पिकाला पाणी द्यावे का?' : '"Should I irrigate my crop today?"')}
          </span>
          <span className="text-[10px] text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
            {lang === 'hi' ? 'मेरी फसल में बीमारी क्यों हो रही है?' : (lang === 'mr' ? 'माझ्या पिकाला कोणता खत द्यावा?' : '"What fertilizer is best for tomato?"')}
          </span>
        </div>
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-xs text-gray-700 dark:text-gray-300">
          <span className="font-bold text-gray-400 text-[10px] uppercase block">You Said:</span>
          "{transcript}"
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 dark:bg-red-950/20 p-3 rounded-xl">
          <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* AI Response Card */}
      {aiResponse && (
        <div className="glass-panel p-5 rounded-2xl border border-green-500/20 bg-green-500/5 space-y-3 animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-extrabold uppercase tracking-wide text-green-700 dark:text-green-400">SmartAgri AI Advice</span>
            {isPlayingAudio ? (
              <button onClick={stopAudio} className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-colors">
                <Square className="h-3.5 w-3.5 fill-current" /> Stop Audio
              </button>
            ) : (
              <button onClick={() => speakText(aiResponse)} className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors">
                <Volume2 className="h-3.5 w-3.5" /> 🔊 Listen Audio
              </button>
            )}
          </div>

          <p className="text-xs text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-line font-medium">
            {aiResponse}
          </p>
        </div>
      )}

      {/* Fallback Text Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSendQuery(); }} className="flex gap-2">
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder={lang === 'hi' ? 'अपनी फसल से जुड़ा प्रश्न लिखें...' : (lang === 'mr' ? 'तुमचा प्रश्न टाइप करा...' : 'Type your farming question here...')}
          className="flex-1 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl px-4 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          disabled={isThinking || !textInput.trim()}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <Send className="h-4 w-4" /> Send
        </button>
      </form>
    </div>
  );
};

export default SmartAgriVoice;
