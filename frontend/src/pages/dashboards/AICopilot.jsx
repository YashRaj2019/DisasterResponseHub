import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Zap, ShieldAlert, Navigation, Loader2, Mic, Settings, Maximize2, Trash2, Cpu, Globe, Activity, CheckCircle2, AlertCircle, MapPin, Wind, Thermometer, Droplets, Minimize2, Paperclip, MoreHorizontal, Smile, File, Image as ImageIcon, Folder, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';

const INITIAL_MESSAGES = [
  { 
    id: 1, 
    sender: 'ai', 
    text: "Operational. I am DisasterLink AI-V4. Connected to USGS Earthquake feeds, NOAA Weather satellites, and local dispatch nodes. How can I assist with your situational awareness today?",
    type: 'intro',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

const SUGGESTIONS = [
  { icon: ShieldAlert, text: 'Analyze Earthquake Protocol', color: 'red' },
  { icon: Navigation, text: 'Optimize Evacuation Routes', color: 'blue' },
  { icon: Wind, text: 'Local Hazard Assessment', color: 'emerald' },
];

const AICopilot = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingStatus, setTypingStatus] = useState('Analyzing data...');
  const [isRecording, setIsRecording] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      name: file.name,
      type: file.type,
      size: (file.size / 1024).toFixed(1) + ' KB',
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    setAttachedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Simulated "Streaming" Response Effect
  const streamMessage = (fullText, card = null) => {
    const messageId = Date.now();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages(prev => [...prev, { id: messageId, sender: 'ai', text: '', card, timestamp }]);
    
    let index = 0;
    const interval = setInterval(() => {
      setMessages(prev => prev.map(m => {
        if (m.id === messageId) {
          return { ...m, text: fullText.slice(0, index + 3) };
        }
        return m;
      }));
      index += 3;
      if (index >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 20);
  };

  const generateAIResponse = (userText, files = []) => {
    const text = userText.toLowerCase();
    
    if (files.length > 0) {
      const fileNames = files.map(f => f.name).join(', ');
      return {
        text: `I have successfully received and analyzed your uploaded file(s): **${fileNames}**. \n\nI am cross-referencing this data with current disaster parameters. Based on the file contents, I've updated your local safety score. \n\n*Would you like me to generate a formal impact report based on this data?*`,
        card: { type: 'data', title: 'File Intel Analysis', value: 'Verified' }
      };
    }

    if (text.includes('earthquake')) {
      return {
        text: "**CRITICAL ALERT: SEISMIC EVENT PROTOCOL**\n\n1. **DROP:** Immediately drop to your hands and knees.\n2. **COVER:** Take cover under a sturdy table or desk. Stay away from glass.\n3. **HOLD ON:** Stay put until shaking stops.\n\n*Status:* Satellite DL-Seis1 is scanning your current sector. Structural integrity nodes are broadcasting warnings to all building managers within a 5km radius.",
        card: { type: 'alert', title: 'Seismic Protocol Active', value: 'Level 4 Critical' }
      };
    }
    if (text.includes('evacuation') || text.includes('route')) {
      return {
        text: "Accessing Traffic Nodes...\n\n**SAFE-PASSAGE CALCULATION COMPLETE:**\nI recommend taking the **Eastern Bypass via Sector 7**. The main 5th Ave Bridge is currently flagged for water overflow risk. \n\n*Live Update:* A temporary shelter has just opened at the North Station. Would you like the digital navigation link?",
        card: { type: 'nav', title: 'Route Optimization', value: '98% Reliability' }
      };
    }
    
    return {
      text: "I am analyzing your query against the DisasterLink Knowledge Base. My primary goal is your safety. If you need immediate medical assistance, please click the **SOS** button in the emergency menu. Otherwise, please provide more context so I can assist further.",
      card: null
    };
  };

  const handleSend = (e, presetText = null) => {
    if (e) e.preventDefault();
    const messageText = presetText || input;
    if (!messageText.trim() && attachedFiles.length === 0 || isTyping) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = { id: Date.now(), sender: 'user', text: messageText, files: [...attachedFiles], timestamp };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setAttachedFiles([]);
    setIsTyping(true);

    const statuses = ['Analyzing files...', 'Scanning satellite feeds...', 'Correlating protocols...', 'Fetching Gemini Intel...'];
    let i = 0;
    const statusInterval = setInterval(() => {
      setTypingStatus(statuses[i % statuses.length]);
      i++;
    }, 600);

    setTimeout(() => {
      clearInterval(statusInterval);
      const response = generateAIResponse(messageText, newMsg.files);
      streamMessage(response.text, response.card);
    }, 2000);
  };

  return (
    <div className="h-[calc(100vh-4rem)] sm:h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6 animate-in fade-in duration-700">
      
      {/* Hidden Inputs */}
      <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        <div className={`flex-1 bg-white dark:bg-[#0a0f1c] border border-slate-100 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden relative transition-all duration-500 ${
          isMaximized ? 'fixed inset-0 lg:inset-4 z-[200] rounded-none lg:rounded-[3.5rem]' : 'rounded-none sm:rounded-[2.5rem]'
        }`}>
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center z-20 bg-white/80 dark:bg-[#0a0f1c]/80 backdrop-blur-md">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 rounded-xl sm:rounded-2xl flex items-center justify-center text-blue-400 shadow-xl border border-slate-800">
                   <Bot className="h-5 w-5 sm:h-6 sm:h-6" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-500 rounded-full border-2 sm:border-4 border-white dark:border-[#0a0f1c]"></div>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  AI Copilot <Sparkles className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
                </h2>
                <div className="flex items-center gap-1.5 text-[8px] sm:text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Gemini-V4 Intel
                </div>
              </div>
            </div>
            <div className="flex gap-1.5 sm:gap-2">
              <button 
                onClick={() => setIsMaximized(!isMaximized)}
                className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all shadow-md ${isMaximized ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-blue-500'}`}
              >
                {isMaximized ? <Minimize2 className="h-4 w-4 sm:h-5 sm:h-5" /> : <Maximize2 className="h-4 w-4 sm:h-5 sm:h-5" />}
              </button>
              <button onClick={() => setMessages(INITIAL_MESSAGES)} className="p-2 sm:p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 rounded-lg sm:rounded-xl transition-all shadow-md">
                <Trash2 className="h-4 w-4 sm:h-5 sm:h-5" />
              </button>
            </div>
          </div>

          {isMaximized && (
            <div className="fixed inset-0 z-[-1] bg-slate-950/60 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setIsMaximized(false)}></div>
          )}
          
          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-10 space-y-6 sm:space-y-8 custom-scrollbar z-10 scroll-smooth bg-slate-50/30 dark:bg-transparent">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                
                <div className={`flex gap-2 sm:gap-3 max-w-[90%] sm:max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {msg.sender === 'ai' && (
                    <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 mt-1 shadow-lg">
                      <Bot className="h-3.5 w-3.5 sm:h-4 sm:h-4" />
                    </div>
                  )}
                  
                  <div className={`flex flex-col gap-1.5 sm:gap-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-base leading-relaxed shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none'
                    }`}>
                      <div className="whitespace-pre-wrap">
                        {msg.text.split('**').map((chunk, i) => i % 2 === 1 ? <strong key={i} className={msg.sender === 'user' ? 'text-white' : 'text-blue-500 dark:text-white font-black'}>{chunk}</strong> : chunk)}
                      </div>
                      {msg.id === messages[messages.length-1].id && isTyping && msg.sender === 'ai' && (
                        <span className="inline-block w-1 h-3 sm:h-4 bg-blue-500 ml-1 animate-pulse align-middle"></span>
                      )}
                    </div>
                    
                    {/* Render Files in chat */}
                    {msg.files && msg.files.length > 0 && (
                      <div className={`flex flex-wrap gap-1.5 sm:gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.files.map((f, i) => (
                          <div key={i} className="flex items-center gap-1.5 p-1.5 sm:p-2 bg-white/10 dark:bg-slate-800/50 rounded-xl border border-white/10 text-[9px] sm:text-[10px] font-bold text-slate-400">
                             {f.preview ? <img src={f.preview} className="w-5 h-5 sm:w-6 sm:h-6 rounded object-cover" /> : <File className="h-3.5 w-3.5 sm:h-4 sm:h-4" />}
                             <span className="truncate max-w-[80px] sm:max-w-[100px]">{f.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                      {msg.sender === 'user' ? 'You' : 'AI Copilot'} • {msg.timestamp}
                    </span>
                  </div>
                </div>

                {msg.card && msg.text.length > 0 && (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className={`mt-4 p-3 sm:p-4 rounded-2xl border flex items-center gap-3 sm:gap-4 w-fit max-w-[85%] ${
                      msg.card.type === 'alert' ? 'bg-red-500/5 border-red-500/20 text-red-500' :
                      msg.card.type === 'nav' ? 'bg-blue-500/5 border-blue-500/20 text-blue-500' :
                      'bg-emerald-500/5 border-emerald-500/20 text-emerald-500'
                    }`}
                  >
                    <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg">
                      {msg.card.type === 'alert' ? <ShieldAlert className="h-4 w-4 sm:h-5 sm:h-5" /> : 
                       msg.card.type === 'nav' ? <Navigation className="h-4 w-4 sm:h-5 sm:h-5" /> : <CheckCircle2 className="h-4 w-4 sm:h-5 sm:h-5" />}
                    </div>
                    <div>
                      <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest opacity-60">{msg.card.title}</p>
                      <p className="text-[10px] sm:text-xs font-black">{msg.card.value}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}

            {isTyping && messages[messages.length-1].sender === 'user' && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex gap-2 sm:gap-3 items-center">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 shadow-lg">
                    <Bot className="h-3.5 w-3.5 sm:h-4 sm:h-4" />
                  </div>
                  <div className="px-4 py-2 sm:px-5 sm:py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center gap-2">
                     <div className="flex gap-1">
                        <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                     </div>
                     <span className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 sm:ml-2">{typingStatus}</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Panel */}
          <div className="p-4 sm:p-8 bg-white dark:bg-[#0a0f1c] border-t border-slate-100 dark:border-slate-800 z-10">
            <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
              
              {/* Attached Files Bar */}
              <AnimatePresence>
                {attachedFiles.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="flex flex-wrap gap-2 pb-2 sm:pb-4"
                  >
                    {attachedFiles.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-100 dark:bg-slate-800 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700">
                         {f.preview ? <img src={f.preview} className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg object-cover" /> : <File className="h-4 w-4 sm:h-5 sm:h-5 text-blue-500" />}
                         <div>
                            <p className="text-[10px] sm:text-xs font-black text-slate-700 dark:text-white leading-none mb-1 truncate max-w-[80px] sm:max-w-none">{f.name}</p>
                            <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{f.size}</p>
                         </div>
                         <button onClick={() => removeFile(i)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400">
                           <X className="h-3.5 w-3.5" />
                         </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSend} className="relative group">
                <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400">
                   <Paperclip 
                     onClick={() => fileInputRef.current.click()}
                     className="h-4 w-4 sm:h-5 sm:h-5 hover:text-blue-500 cursor-pointer transition-colors active:scale-90" 
                   />
                </div>
                <input 
                  type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Gemini anything..."
                  className="w-full pl-11 sm:pl-14 pr-24 sm:pr-32 py-4 sm:py-5 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl sm:rounded-3xl outline-none focus:border-blue-500 dark:focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 text-xs sm:text-base text-slate-900 dark:text-white font-bold transition-all"
                />
                <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex gap-0.5 sm:gap-1">
                  <button type="button" className="hidden sm:block p-2.5 text-slate-400 hover:text-blue-500 transition-colors"><Smile className="h-5 w-5" /></button>
                  <button type="button" onClick={() => setIsRecording(!isRecording)} className={`p-2 sm:p-2.5 rounded-xl transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-blue-500'}`}>
                     <Mic className="h-4 w-4 sm:h-5 sm:h-5" />
                  </button>
                  <button type="submit" className="p-2 sm:p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-90">
                     <Send className="h-4 w-4 sm:h-5 sm:h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Side Intelligence Panel (Only visible in normal mode) */}
      {!isMaximized && (
        <div className="hidden lg:flex w-80 flex-col gap-6 animate-in slide-in-from-right-4 duration-500">
          <div className="p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full blur-2xl"></div>
             <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2"><Cpu className="h-5 w-5 text-blue-500" /> Gemini Core</h3>
             <div className="space-y-6">
                <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-widest">
                      <span>Neural Load</span>
                      <span>32%</span>
                   </div>
                   <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '32%' }} className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></motion.div>
                   </div>
                </div>
                <div className="space-y-4 pt-4">
                   <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <Globe className="h-5 w-5 text-emerald-500" />
                      <div>
                         <p className="text-[10px] font-black text-slate-500 uppercase">Satellite Mesh</p>
                         <p className="text-xs font-bold text-white">Active & Syncing</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-white dark:bg-[#0a0f1c] border border-slate-100 dark:border-slate-800 shadow-xl flex-1">
             <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2"><Thermometer className="h-5 w-5 text-red-500" /> Sensor Hub</h3>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                   <Thermometer className="h-5 w-5 text-orange-500 mx-auto mb-2" />
                   <p className="text-[10px] font-black text-slate-400 uppercase">Temp</p>
                   <p className="text-sm font-black text-slate-900 dark:text-white">24°C</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                   <Wind className="h-5 w-5 text-blue-400 mx-auto mb-2" />
                   <p className="text-[10px] font-black text-slate-400 uppercase">Wind</p>
                   <p className="text-sm font-black text-slate-900 dark:text-white">12km/h</p>
                </div>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AICopilot;
