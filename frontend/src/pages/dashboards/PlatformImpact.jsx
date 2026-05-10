import React, { useState, useEffect } from 'react';
import { Activity, Clock, HeartPulse, ShieldCheck, TrendingUp, Zap, Users, BarChart3, X, ChevronRight, Globe, Server, Network, Database, Cpu, History, Search, Download, Filter, Loader2, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATS = [
  { id: 'resp', label: 'Avg. Response Time', value: '4.2', unit: 'Mins', subtext: 'Reduced by 68%', icon: Clock, color: 'emerald', daily: '3.8', weekly: '4.2', monthly: '4.5' },
  { id: 'lives', label: 'Lives Impacted', value: '14,209', unit: '', subtext: 'Since Platform Launch', icon: HeartPulse, color: 'red', daily: '+12', weekly: '+84', monthly: '+340' },
  { id: 'vol', label: 'Active Volunteers', value: '1,248', unit: '', subtext: '+12% this month', icon: Users, color: 'blue', daily: '1,248', weekly: '1,190', monthly: '1,050' },
  { id: 'up', label: 'System Uptime', value: '99.99', unit: '%', subtext: 'During active crises', icon: Zap, color: 'yellow', daily: '100%', weekly: '99.99%', monthly: '99.95%' },
];

const COMPARISONS = [
  { metric: 'Emergency Dispatch Delay', legacy: 85, disasterLink: 15, unit: 'Seconds' },
  { metric: 'Resource Allocation Accuracy', legacy: 40, disasterLink: 94, unit: '%' },
  { metric: 'Volunteer Mobilization Rate', legacy: 22, disasterLink: 88, unit: '%' },
];

const SUCCESS_LOGS = [
  { id: 1, title: 'Flash Flood Rescue - Sector 4', desc: 'DisasterLink auto-routed 3 boats to stranded families within 12 minutes of the distress signal.', time: '2 hours ago', sector: 'Marine Rescue', resources: '3 Rescue Boats, 1 Drone', team: 'Delta Force', status: 'Resolved' },
  { id: 2, title: 'Medical Supply Drop - Central High', desc: 'Identified critical shortage of O-Negative blood. System rerouted nearby transport drone successfully.', time: '5 hours ago', sector: 'Medical', resources: '1 Cargo Drone, 4 Units Blood', team: 'Med-Link', status: 'Resolved' },
  { id: 3, title: 'Missing Child Reunited', desc: 'Facial recognition ping on the Missing Persons database led to a safe recovery at the North Station.', time: '1 day ago', sector: 'Security', resources: 'AI Facial recognition, 2 Officers', team: 'Ground Patrol', status: 'Resolved' },
  { id: 4, title: 'Structural Safety Audit', desc: 'Assessed 15 buildings for stability using satellite imagery analysis after the earthquake.', time: '2 days ago', sector: 'Engineering', resources: 'Satellite Analysis', team: 'Eng-Hub', status: 'Resolved' },
];

const LiveTelemetryModal = ({ isOpen, onClose }) => {
  const [pings, setPings] = useState([24, 28, 22, 31, 29, 25, 27]);
  
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setPings(prev => [...prev.slice(1), Math.floor(Math.random() * (35 - 20) + 20)]);
    }, 2000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#0a0f1c] border border-white/10 w-full max-w-5xl rounded-[2.5rem] shadow-[0_0_100px_rgba(16,185,129,0.1)] overflow-hidden flex flex-col h-[85vh]"
      >
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-emerald-500/10 to-transparent">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                 <Globe className="h-6 w-6 animate-spin-slow" />
              </div>
              <div>
                 <h2 className="text-2xl font-black text-white tracking-tight">Global Live Telemetry</h2>
                 <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> System Operational
                 </p>
              </div>
           </div>
           <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full text-white/50 transition-colors"><X className="h-6 w-6" /></button>
        </div>

        <div className="p-10 flex-1 overflow-y-auto custom-scrollbar">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                 <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 relative overflow-hidden">
                    <div className="flex justify-between items-end mb-6">
                       <div>
                          <h4 className="text-sm font-black text-white/40 uppercase tracking-widest mb-1">Network Latency</h4>
                          <p className="text-4xl font-black text-white">{pings[pings.length-1]}<span className="text-sm font-bold text-white/30 ml-1">ms</span></p>
                       </div>
                       <Network className="h-8 w-8 text-emerald-500 opacity-50" />
                    </div>
                    <div className="flex items-end gap-2 h-32">
                       {pings.map((p, i) => (
                         <motion.div 
                           key={i} layout
                           initial={{ height: 0 }} animate={{ height: `${p}%` }}
                           className="flex-1 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg opacity-80"
                         ></motion.div>
                       ))}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-4">
                       <Server className="h-8 w-8 text-blue-500" />
                       <div>
                          <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Server Load</p>
                          <p className="text-xl font-black text-white">24.2%</p>
                       </div>
                    </div>
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-4">
                       <Database className="h-8 w-8 text-purple-500" />
                       <div>
                          <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">DB Sync</p>
                          <p className="text-xl font-black text-white">Verified</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-6">
                 <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <History className="h-4 w-4 text-emerald-500" /> System Events
                 </h4>
                 <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="flex gap-4 items-start border-l-2 border-white/5 pl-4 py-2">
                         <div className="mt-1 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                         <div>
                            <p className="text-xs font-bold text-white/80">Satellite Ping #{1042 + i}</p>
                            <p className="text-[10px] text-white/30">Authored by DL-EdgeNode-04</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

const LogDetailModal = ({ log, onClose }) => {
  if (!log) return null;
  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl">
       <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0a0f1c] border border-white/10 w-full max-w-xl rounded-[2.5rem] p-10 space-y-8">
          <div className="flex justify-between items-start">
             <div className="p-4 bg-emerald-500/10 rounded-2xl">
                <ShieldCheck className="h-8 w-8 text-emerald-500" />
             </div>
             <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/40 transition-colors"><X className="h-6 w-6" /></button>
          </div>
          <div className="space-y-2">
             <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full">{log.sector}</span>
             <h2 className="text-3xl font-black text-white tracking-tight">{log.title}</h2>
             <p className="text-slate-400 font-medium">{log.desc}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Resources Used</p>
                <p className="text-sm font-bold text-white">{log.resources}</p>
             </div>
             <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Assigned Team</p>
                <p className="text-sm font-bold text-white">{log.team}</p>
             </div>
          </div>
          <button onClick={onClose} className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black transition-all hover:bg-emerald-500 hover:text-white">Close Report</button>
       </motion.div>
    </div>
  );
};

const PlatformImpact = () => {
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [showArchive, setShowArchive] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [nodes, setNodes] = useState([
    { name: 'AI Core', status: 'Optimal', health: 98, load: 24 },
    { name: 'Neural Grid', status: 'Active', health: 94, load: 45 },
    { name: 'Satellite Link', status: 'Syncing', health: 100, load: 12 },
    { name: 'Rescue DB', status: 'Optimal', health: 99, load: 31 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(n => ({
        ...n,
        load: Math.max(5, Math.min(95, n.load + (Math.random() * 10 - 5)))
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDownload = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (isDownloading) return;

    setIsDownloading(true);
    setToastMessage('Compiling Impact_Analysis_2026.pdf...');
    setShowToast(true);
    
    setTimeout(() => {
      setIsDownloading(false);
      setToastMessage('Impact Report Downloaded Successfully!');
      
      // Pure JS way to trigger download notification without redirecting
      const blob = new Blob(["DisasterLink Impact Report - Simulated Data"], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "DisasterLink_Impact_Report.txt";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setTimeout(() => setShowToast(false), 3000);
    }, 2500);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-12 relative overflow-hidden">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[150] bg-slate-900 dark:bg-emerald-500 text-white px-8 py-4 rounded-3xl flex items-center gap-4 shadow-2xl font-black tracking-tight border border-white/10"
          >
            <CheckCircle2 className="h-6 w-6 text-emerald-400" /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Platform Impact</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-xl max-w-2xl leading-relaxed">Real-time metrics demonstrating the life-saving effectiveness of DisasterLink infrastructure.</p>
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
           <button 
             onClick={() => setIsTelemetryOpen(true)}
             className="flex-1 lg:flex-none px-8 py-4 bg-slate-900 dark:bg-emerald-500 text-white rounded-2xl font-black tracking-tight flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/20 hover:scale-105 transition-all group"
           >
             <Activity className="h-5 w-5 group-hover:animate-pulse" /> Live Telemetry
           </button>
           
           {/* Download Trigger */}
           <div 
             onClick={handleDownload}
             className={`p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 hover:text-blue-500 transition-all shadow-xl cursor-pointer flex items-center gap-3 ${isDownloading ? 'opacity-50' : ''}`}
           >
             {isDownloading ? <Loader2 className="h-6 w-6 animate-spin text-blue-500" /> : <Download className="h-6 w-6" />}
             {isDownloading && <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 animate-pulse">Exporting...</span>}
           </div>
        </div>
      </div>

      <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl w-fit border border-slate-200 dark:border-slate-800 shadow-inner">
         {['daily', 'weekly', 'monthly'].map(f => (
           <button 
             key={f} onClick={() => setTimeFilter(f)}
             className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${timeFilter === f ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
           >
             {f}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {STATS.map((stat, idx) => {
          const Icon = stat.icon;
          const displayVal = stat[timeFilter] || stat.value;
          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
              key={idx} 
              className="bg-white dark:bg-[#0a0f1c] rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-[0_10px_40px_rgba(0,0,0,0.04)] relative group hover:-translate-y-2 transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-500/10 text-${stat.color}-500 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform`}>
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] mb-2">{stat.label}</h3>
              <p className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">{displayVal}<span className="text-xl ml-1 opacity-40 font-bold">{stat.unit}</span></p>
              <div className="flex items-center gap-2 pt-4 border-t border-slate-50 dark:border-slate-800">
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                </div>
                <span className="text-xs font-bold text-slate-500">{stat.subtext}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Global System Pulse Section */}
      <div className="bg-slate-900 rounded-[3rem] p-10 border border-white/5 relative overflow-hidden shadow-2xl">
         <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent"></div>
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-1 space-y-4">
               <div className="p-3 bg-blue-500/10 rounded-2xl w-fit"><Activity className="h-6 w-6 text-blue-500" /></div>
               <h3 className="text-2xl font-black text-white tracking-tight">Global System Pulse</h3>
               <p className="text-slate-500 text-sm font-medium">Monitoring core infrastructure health across 14 regional nodes.</p>
               <div className="pt-4 flex items-center gap-2">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Protocol Stable</span>
               </div>
            </div>
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
               {nodes.map((node, i) => (
                 <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-[2rem] space-y-6 group hover:bg-white/10 transition-all">
                    <div className="flex justify-between items-start">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{node.name}</p>
                       <span className="text-[10px] font-black text-emerald-500">{node.health}%</span>
                    </div>
                    <div className="relative h-12 flex items-end gap-1">
                       {[...Array(8)].map((_, j) => {
                         const h = Math.random() * node.load + 20;
                         return <div key={j} style={{ height: `${h}%` }} className="flex-1 bg-blue-500/40 rounded-t-sm group-hover:bg-blue-500 transition-all"></div>;
                       })}
                    </div>
                    <div>
                       <p className="text-xs font-black text-white">{node.status}</p>
                       <p className="text-[10px] text-slate-500 font-bold">Latency: {Math.floor(node.load/2)}ms</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
           <div className="bg-white dark:bg-[#0a0f1c] rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-2xl h-full">
              <div className="flex items-center justify-between mb-12">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-2xl"><BarChart3 className="text-blue-500 h-6 w-6" /></div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Performance Benchmarks</h3>
                 </div>
                 <div className="flex gap-4">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 bg-slate-300 dark:bg-slate-700 rounded-full"></span><span className="text-[10px] font-black uppercase text-slate-400">Legacy</span></div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 rounded-full"></span><span className="text-[10px] font-black uppercase text-slate-400">DisasterLink</span></div>
                 </div>
              </div>

              <div className="space-y-12">
                 {COMPARISONS.map((comp, idx) => (
                   <div key={idx} className="space-y-4">
                      <div className="flex justify-between items-center px-1">
                         <span className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{comp.metric}</span>
                         <span className="text-xs font-bold text-blue-500">{(comp.disasterLink / comp.legacy * 100).toFixed(0)}% Efficiency Gain</span>
                      </div>
                      
                      <div className="space-y-3">
                         <div className="flex items-center gap-4 group">
                            <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                               <motion.div initial={{ width: 0 }} animate={{ width: `${comp.legacy}%` }} className="h-full bg-slate-300 dark:bg-slate-700 rounded-full"></motion.div>
                            </div>
                            <span className="w-20 text-right text-[10px] font-black text-slate-400">{comp.legacy}{comp.unit === '%' ? '%' : `s`}</span>
                         </div>
                         <div className="flex items-center gap-4">
                            <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden shadow-inner p-1">
                               <motion.div initial={{ width: 0 }} animate={{ width: `${comp.disasterLink}%` }} className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full shadow-lg relative">
                                  <div className="absolute inset-0 bg-white/10 opacity-30 animate-pulse"></div>
                               </motion.div>
                            </div>
                            <span className="w-20 text-right text-xs font-black text-blue-600 dark:text-blue-400">{comp.disasterLink}{comp.unit === '%' ? '%' : `s`}</span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="lg:col-span-1">
           <div className="bg-slate-900 rounded-[3rem] p-10 border border-white/5 shadow-2xl h-full relative overflow-hidden flex flex-col">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-[80px]"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-[80px]"></div>
              
              <div className="flex items-center justify-between mb-10 relative z-10">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/20 rounded-2xl"><ShieldCheck className="text-emerald-400 h-6 w-6" /></div>
                    <h3 className="text-2xl font-black text-white tracking-tight">Mission Logs</h3>
                 </div>
                 <Filter className="h-5 w-5 text-white/30 cursor-pointer hover:text-white transition-colors" />
              </div>

              <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2 relative z-10">
                 {SUCCESS_LOGS.map((log) => (
                   <div 
                     key={log.id} onClick={() => setSelectedLog(log)}
                     className="p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-emerald-500/30 transition-all cursor-pointer group"
                   >
                      <div className="flex justify-between items-start mb-3">
                         <h4 className="font-bold text-white leading-tight group-hover:text-emerald-400 transition-colors">{log.title}</h4>
                         <ChevronRight className="h-4 w-4 text-white/20 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="text-xs font-medium text-slate-400 mb-5 line-clamp-2">{log.desc}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{log.time}</span>
                         <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black rounded-lg uppercase tracking-tighter">Verified</span>
                      </div>
                   </div>
                 ))}
              </div>

              <button 
                onClick={() => setShowArchive(true)}
                className="w-full mt-10 py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10 transition-all relative z-10 shadow-2xl active:scale-95"
              >
                 View Mission Archive
              </button>
           </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isTelemetryOpen && <LiveTelemetryModal isOpen={isTelemetryOpen} onClose={() => setIsTelemetryOpen(false)} />}
        {selectedLog && <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />}
        {showArchive && (
           <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl">
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 border border-white/10 w-full max-w-4xl rounded-[3rem] p-12 space-y-10 max-h-[85vh] overflow-y-auto custom-scrollbar">
                 <div className="flex justify-between items-center">
                    <h2 className="text-4xl font-black text-white tracking-tighter">Historical Mission Archive</h2>
                    <button onClick={() => setShowArchive(false)} className="p-3 hover:bg-white/5 rounded-full text-white/40"><X className="h-8 w-8" /></button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...SUCCESS_LOGS, ...SUCCESS_LOGS].map((log, i) => (
                      <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-4">
                         <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-blue-400 uppercase">{log.sector}</span>
                            <span className="text-[10px] text-white/20">{log.time}</span>
                         </div>
                         <h4 className="font-bold text-white text-lg">{log.title}</h4>
                         <p className="text-xs text-slate-400">{log.desc}</p>
                      </div>
                    ))}
                 </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PlatformImpact;
