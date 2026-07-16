import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, User, MessageSquareHeart, Sparkles } from 'lucide-react';
import axios from 'axios';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am your AI Agronomist chatbot. Ask me anything about crop varieties, soil moisture telemetry, pest controls, or mandi market rates."
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const samplePrompts = [
    "My tomato leaves are yellow",
    "Best crop for black soil",
    "When should I irrigate?",
    "Organic pest treatment"
  ];

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend) => {
    const msgText = textToSend || inputText;
    if (!msgText.trim()) return;

    if (!textToSend) setInputText('');

    // Append user message
    const userMsg = { role: 'user', content: msgText };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // Call direct Python FastAPI chatbot
      const res = await axios.post('http://localhost:8000/api/chat', {
        message: msgText,
        history: messages.slice(-5) // Send last few messages for context
      });

      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I am having trouble connecting to my knowledge base. Make sure the Python AI microservice is running locally."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-3xl border border-gray-200/50 dark:border-gray-800/30 flex flex-col h-[500px] overflow-hidden shadow-xl text-left">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-600/10 px-6 py-4 border-b border-gray-200/50 dark:border-gray-800/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 p-2 rounded-xl text-white shadow-md animate-pulse">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
              Krishi AI Consultant
              <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
            </h4>
            <span className="text-[10px] text-green-600 dark:text-green-400 font-bold">Online & Ready</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => {
          const isBot = msg.role === 'assistant';
          return (
            <div key={i} className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
              {isBot && (
                <div className="bg-green-100 dark:bg-green-950/40 p-1.5 rounded-full text-green-700 dark:text-green-400 flex-shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  isBot
                    ? 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-800/40 rounded-tl-none'
                    : 'bg-green-600 text-white font-semibold rounded-tr-none'
                }`}
              >
                {msg.content.split('\n').map((line, idx) => (
                  <p key={idx} className={idx > 0 ? 'mt-1' : ''}>{line}</p>
                ))}
              </div>
              {!isBot && (
                <div className="bg-green-600 p-1.5 rounded-full text-white flex-shrink-0">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}
        {loading && (
          <div className="flex items-start gap-3 justify-start">
            <div className="bg-green-100 dark:bg-green-950/40 p-1.5 rounded-full text-green-700 dark:text-green-400 flex-shrink-0">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/40 p-3.5 rounded-2xl rounded-tl-none flex gap-1 items-center">
              <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-bounce"></span>
              <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      {/* Suggested Prompts (if chat is empty or just has welcome) */}
      {messages.length <= 1 && (
        <div className="px-6 py-2 border-t border-gray-100 dark:border-gray-800/20">
          <span className="text-[9px] text-gray-400 font-bold block uppercase mb-1.5">Quick Prompts</span>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="text-[10px] px-2.5 py-1 rounded-full border border-green-200 dark:border-green-900 bg-green-50/20 dark:bg-green-950/20 text-green-700 dark:text-green-400 hover:bg-green-100/50 dark:hover:bg-green-950/40 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Inputs Footer */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
        className="p-4 border-t border-gray-200/50 dark:border-gray-800/30 flex gap-2"
      >
        <input
          type="text"
          placeholder="Ask AI Agronomist (e.g. Yellow leaves on rice crop)..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 text-xs p-3 rounded-xl glass-input outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          disabled={loading || !inputText.trim()}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white p-3 rounded-xl shadow-md transition-colors"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
