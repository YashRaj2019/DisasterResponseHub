import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Radio, Monitor, Globe, Activity, Terminal, ShieldAlert, Cpu, Network, Database, Siren, Bell, Zap, Info, ChevronRight, X, Play, Square, Loader2, Signal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COMMS_LOG = [
  { id: 1, type: 'RADIO', text: 'Sector 4 units established on secondary frequency. Visual on flood line.', time: '14:22:10', status: 'verified' },
  { id: 2, type: 'DIGITAL', text: 'Telemetry Node DL-44 reporting 15% increase in seismic noise.', time: '14:22:15', status: 'critical' },
  { id: 3, type: 'RADIO', text: 'Air Support Alpha-1 entering holding pattern over Central High.', time: '14:22:30', status: 'active' },
  { id: 4, type: 'VOICE', text: 'Supply Drop confirmed at LZ-Gamma. Medical kit deployed.', time: '14:22:45', status: 'verified' },
  { id: 5, type: 'SYSTEM', text: 'Satellite Link re-established. Resolution: 0.5m/pixel.', time: '14:22:58', status: 'verified' },
];

const FEEDS = [
  { id: 1, name: 'SAT-01: NORTH SECTOR', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80', active: true },
  { id: 2, name: 'UAV-04: LZ-GAMMA', url: 'https://images.unsplash.com/photo-1506701908217-140a240397ce?auto=format&fit=crop&w=400&q=80', active: false },
  { id: 3, name: 'THERMAL: SECTOR 7', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80', active: true },
  { id: 4, name: 'CCTV: CENTRAL HUB', url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80', active: false },
];

const ControlRoom = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [activeFeeds, setActiveFeeds] = useState([1, 3]);
  const [logs, setLogs] = useState(COMMS_LOG);
  const [isLive, setIsLive] = useState(true);
  const [signalStrength, setSignalStrength] = useState(98);
  const scrollRef = useRef(null);

  // Restricted Access Screen for Citizens
  if (userInfo?.role?.toLowerCase() === 'citizen') {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-slate-900 text-white p-6 text-center">
         <motion.div 
           initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
           className="max-w-md w-full bg-slate-800 border border-red-500/30 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden"
         >
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
            <div className="p-4 bg-red-600/10 rounded-2xl w-fit mx-auto mb-6">
               <ShieldAlert className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-black tracking-tight mb-4 uppercase">Restricted Tactical Access</h2>
            <p className="text-slate-400 font-medium text-sm leading-relaxed mb-8">
               The Tactical Control Room contains sensitive operational data and live satellite feeds restricted to **Authorized Responders** only.
            </p>
            <div className="space-y-3">
               <button 
                 onClick={() => navigate('/dashboard/volunteers')}
                 className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
               >
                  Apply to Volunteer Force
               </button>
               <button 
                 onClick={() => navigate('/dashboard')}
                 className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10 transition-all"
               >
                  Return to Dashboard
               </button>
            </div>
         </motion.div>
      </div>
    );
  }

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const newLog = {
        id: Date.now(),
        type: ['RADIO', 'DIGITAL', 'SYSTEM', 'VOICE'][Math.floor(Math.random() * 4)],
        text: `Encrypted transmission burst ${Math.floor(Math.random() * 1000)} - Routing via Node-${Math.floor(Math.random() * 20)}`,
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        status: Math.random() > 0.8 ? 'critical' : 'active'
      };
      setLogs(prev => [...prev.slice(-15), newLog]);
      setSignalStrength(prev => Math.max(85, Math.min(100, prev + (Math.random() * 4 - 2))));
    }, 4000);
    return () => clearInterval(interval);
  }, [isLive]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] bg-black text-white overflow-hidden font-mono">
      
      {/* Top Tactical Bar */}
      <div className="h-auto sm:h-14 bg-slate-900 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-3 sm:py-0 shrink-0 relative z-20 gap-4 sm:gap-0">
         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 w-full sm:w-auto">
            <div className="flex items-center gap-2">
               <div className="p-1.5 bg-red-600 rounded text-white"><Radio className="h-3 w-3 sm:h-4 sm:h-4 animate-pulse" /></div>
               <span className="text-[10px] sm:text-xs font-black tracking-widest uppercase">Tactical Comms Room</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-white/20"></div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[8px] sm:text-[10px] font-bold text-slate-400">
               <span className="flex items-center gap-1.5"><Signal className="h-3 w-3 text-emerald-500" /> Signal: {signalStrength.toFixed(1)}%</span>
               <span className="flex items-center gap-1.5"><Globe className="h-3 w-3 text-blue-500" /> Nodes: 14 Active</span>
               <span className="flex items-center gap-1.5"><Activity className="h-3 w-3 text-orange-500" /> Latency: 22ms</span>
            </div>
         </div>
         <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            <button onClick={() => setIsLive(!isLive)} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${isLive ? 'bg-red-600/20 text-red-500 border border-red-500/50' : 'bg-slate-800 text-slate-500'}`}>
               {isLive ? '● Live Transmission' : 'Transmission Paused'}
            </button>
            <div className="bg-slate-800 p-2 rounded-lg cursor-pointer hover:bg-slate-700 shrink-0"><Monitor className="h-3 w-3 sm:h-4 sm:h-4" /></div>
         </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
         
         {/* Left: Satellite Feeds Grid */}
         <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-950/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
               {FEEDS.map(feed => (
                 <div key={feed.id} className="relative aspect-video bg-slate-900 rounded-2xl border border-white/5 overflow-hidden group">
                    <img src={feed.url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={feed.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    
                    {/* Scanline Effect */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-50 sm:opacity-100"></div>
                    
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex items-center gap-2">
                       <span className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${feed.active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></span>
                       <span className="text-[8px] sm:text-[10px] font-black tracking-widest uppercase text-white shadow-sm">{feed.name}</span>
                    </div>
                    
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex justify-between items-end">
                       <div className="space-y-0.5 sm:space-y-1">
                          <p className="text-[7px] sm:text-[8px] font-black text-blue-400 uppercase tracking-widest">Coordinates</p>
                          <p className="text-[9px] sm:text-[10px] font-bold">28.6139° N, 77.2090° E</p>
                       </div>
                       <div className="flex gap-1.5 sm:gap-2">
                          <button className="p-1 sm:p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"><Zap className="h-3 w-3" /></button>
                          <button className="p-1 sm:p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"><ShieldAlert className="h-3 w-3" /></button>
                       </div>
                    </div>

                    {/* Camera Grid Markers */}
                    <div className="absolute top-2 right-2 border-t border-r border-white/20 w-3 h-3 sm:w-4 sm:h-4"></div>
                    <div className="absolute bottom-2 left-2 border-b border-l border-white/20 w-3 h-3 sm:w-4 sm:h-4"></div>
                 </div>
               ))}
            </div>

            {/* Tactical Data Panel */}
            <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
               {[
                 { label: 'CPU LOAD', val: '42%', color: 'blue' },
                 { label: 'UPLINK STATUS', val: 'SECURE', color: 'emerald' },
                 { label: 'ENCRYPTION', val: 'AES-256', color: 'purple' },
               ].map((stat, i) => (
                 <div key={i} className="bg-slate-900/50 border border-white/5 p-3 sm:p-4 rounded-xl flex items-center justify-between">
                    <span className="text-[9px] sm:text-[10px] font-black text-slate-500 tracking-widest">{stat.label}</span>
                    <span className={`text-[10px] sm:text-xs font-black text-${stat.color}-500`}>{stat.val}</span>
                 </div>
               ))}
            </div>
         </div>

         {/* Right: Live Comms Log */}
         <div className="w-full lg:w-96 h-64 lg:h-auto bg-slate-900/50 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col overflow-hidden shrink-0">
            <div className="p-3 sm:p-4 border-b border-white/10 bg-slate-900 flex items-center justify-between">
               <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <Terminal className="h-3 w-3 sm:h-4 sm:h-4 text-emerald-500" /> Operations Log
               </h3>
               <span className="text-[8px] font-black bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">Active</span>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
               <AnimatePresence initial={false}>
                  {logs.map((log) => (
                    <motion.div 
                      key={log.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      className="space-y-1.5 group"
                    >
                       <div className="flex items-center gap-2">
                          <span className={`text-[7px] sm:text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                            log.status === 'critical' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-white'
                          }`}>{log.type}</span>
                          <span className="text-[8px] sm:text-[9px] font-bold text-slate-600">{log.time}</span>
                       </div>
                       <p className={`text-[10px] sm:text-[11px] leading-relaxed ${log.status === 'critical' ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                          {log.text}
                       </p>
                    </motion.div>
                  ))}
               </AnimatePresence>
            </div>

            <div className="p-3 sm:p-4 border-t border-white/10 bg-slate-900/80">
               <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">Terminal Ready</span>
               </div>
               <div className="relative">
                  <input 
                    type="text" readOnly placeholder="SYSTEM READ ONLY"
                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-[8px] sm:text-[10px] text-emerald-500 font-bold placeholder:text-slate-700 focus:outline-none"
                  />
                  <Loader2 className="absolute right-3 top-2 h-3 w-3 sm:h-4 sm:h-4 text-slate-700 animate-spin" />
               </div>
            </div>
         </div>

      </div>

      {/* Atmospheric Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-600/5 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-emerald-600/5 rounded-full blur-[120px]"></div>
      </div>

    </div>
  );
};

export default ControlRoom;
