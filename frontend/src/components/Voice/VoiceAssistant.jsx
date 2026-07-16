import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Navigation, MessageSquareDot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const VoiceAssistant = () => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [botResponse, setBotResponse] = useState('');
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  let recognition = null;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  useEffect(() => {
    if (SpeechRecognition) {
      setSpeechSupported(true);
    }
  }, [SpeechRecognition]);

  const speak = (text) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose a friendly male/female english/indian voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-US'));
    if (englishVoice) utterance.voice = englishVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!speechSupported) {
      alert("Speech recognition not supported in this browser. Try Chrome or Edge.");
      return;
    }

    window.speechSynthesis.cancel(); // stop speaking if running
    setIsSpeaking(false);

    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setSpokenText('Listening...');
      setBotResponse('');
    };

    recognition.onresult = async (event) => {
      const resultText = event.results[0][0].transcript;
      setSpokenText(resultText);
      setIsListening(false);
      handleVoiceCommand(resultText);
    };

    recognition.onerror = (event) => {
      console.error('Speech error:', event.error);
      setSpokenText('Could not hear clearly. Try again.');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleVoiceCommand = async (command) => {
    const text = command.toLowerCase();
    
    // 1. Navigation Commands
    if (text.includes('go to dashboard') || text.includes('show dashboard')) {
      setBotResponse("Navigating to your farming dashboard.");
      speak("Navigating to your farming dashboard.");
      navigate('/');
      return;
    }
    if (text.includes('go to farm') || text.includes('show farm') || text.includes('map')) {
      setBotResponse("Opening your interactive farm map.");
      speak("Opening your interactive farm map.");
      navigate('/farms');
      return;
    }
    if (text.includes('go to crop') || text.includes('show crop') || text.includes('planting')) {
      setBotResponse("Navigating to your crop monitoring log.");
      speak("Navigating to your crop monitoring log.");
      navigate('/crops');
      return;
    }
    if (text.includes('soil') || text.includes('chemistry')) {
      setBotResponse("Navigating to soil health analysis page.");
      speak("Navigating to soil health analysis page.");
      navigate('/soil');
      return;
    }
    if (text.includes('expense') || text.includes('income') || text.includes('finance')) {
      setBotResponse("Opening your crop expense and income tracker.");
      speak("Opening your crop expense and income tracker.");
      navigate('/finance');
      return;
    }
    if (text.includes('scheme') || text.includes('government') || text.includes('subsidy')) {
      setBotResponse("Opening government scheme search options.");
      speak("Opening government schemes.");
      navigate('/schemes');
      return;
    }
    if (text.includes('profile') || text.includes('my id') || text.includes('badge')) {
      setBotResponse("Navigating to your profile card.");
      speak("Navigating to your profile card.");
      navigate('/profile');
      return;
    }

    // 2. Chat Query Fallback: ask the Python AI chatbot
    try {
      setBotResponse("Consulting agronomy models...");
      const res = await axios.post('http://localhost:8000/api/chat', { message: command });
      const reply = res.data.response;
      setBotResponse(reply);
      speak(reply);
    } catch (err) {
      console.error(err);
      const errReply = "AI service offline. Navigating to AI studio instead.";
      setBotResponse(errReply);
      speak(errReply);
      navigate('/ai-studio');
    }
  };

  const handleStopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/30 text-left shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <Mic className="h-4.5 w-4.5 text-green-500 animate-pulse" />
            Voice Helper Assistant
          </h4>
          <span className="text-[10px] text-gray-400 block mt-0.5">
            Use voice to navigate or ask questions (e.g. "Go to Farms", "Why tomato leaves turn yellow?")
          </span>
        </div>

        {isSpeaking && (
          <button
            onClick={handleStopSpeaking}
            className="p-2 rounded-xl bg-red-100 dark:bg-red-950/30 text-red-500 hover:bg-red-200 transition-colors"
            title="Stop Speaking"
          >
            <VolumeX className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50/50 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/40">
        {/* Toggle Button */}
        <button
          onClick={startListening}
          disabled={isListening}
          className={`h-16 w-16 rounded-full flex justify-center items-center text-white shadow-lg transition-transform hover:scale-105 duration-200 ${
            isListening
              ? 'bg-red-500 animate-ping'
              : 'bg-gradient-to-tr from-green-500 to-emerald-600 shadow-green-500/20'
          }`}
        >
          {isListening ? <Mic className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </button>

        {/* Status Indicators */}
        <div className="flex-1 w-full text-center sm:text-left">
          {spokenText ? (
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wide">You Said</span>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{spokenText}</p>
            </div>
          ) : (
            <p className="text-xs text-gray-500 font-medium">Click the microphone to start speaking commands...</p>
          )}

          {botResponse && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/50 space-y-1">
              <span className="text-[10px] text-green-600 dark:text-green-400 font-bold block uppercase tracking-wide flex items-center gap-1">
                <Volume2 className="h-3.5 w-3.5" /> Response
              </span>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-semibold">{botResponse}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
