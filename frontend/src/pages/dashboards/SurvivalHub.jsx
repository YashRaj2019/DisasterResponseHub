import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Square, HeartPulse, Backpack, Zap, Droplets, Utensils, Shield, Flame, Waves, AlertTriangle, MapPin, PhoneCall, Bot, Activity, PlusCircle, MinusCircle, ChevronRight, X, Siren, Stethoscope, Wind, Navigation, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SHELTERS = [
  { id: 1, name: 'North Sector Stadium', type: 'High Capacity', dist: '1.2 km', capacity: 84, status: 'Open', color: 'emerald' },
  { id: 2, name: 'Central High School', type: 'Medical Priority', dist: '3.5 km', capacity: 92, status: 'Near Capacity', color: 'orange' },
  { id: 3, name: 'Metro Underground - Level B', type: 'Deep Shelter', dist: '0.8 km', capacity: 45, status: 'Open', color: 'emerald' },
];

const PROCEDURES = [
  { 
    id: 'cpr', 
    title: 'Emergency CPR', 
    icon: HeartPulse, 
    color: 'red',
    steps: ['Check for responsiveness', 'Call for emergency help', 'Start chest compressions (100-120 bpm)', 'Provide rescue breaths (if trained)']
  },
  { 
    id: 'quake', 
    title: 'Seismic Safety', 
    icon: Zap, 
    color: 'orange',
    steps: ['Drop to hands and knees', 'Cover head and neck', 'Hold on until shaking stops', 'Stay clear of exterior walls']
  },
  { 
    id: 'fire', 
    title: 'Fire Evacuation', 
    icon: Flame, 
    color: 'red',
    steps: ['Stay low to the ground', 'Check doors for heat before opening', 'Use stairs, never elevators', 'Signal for help from windows']
  }
];

const KITS = [
  {
    id: 'general',
    title: '72-Hour Survival Kit',
    icon: Backpack,
    color: 'emerald',
    description: 'Minimum required household preparedness kit.',
    items: [
      { id: 'g1', label: 'Water (1 gal/person/day)' },
      { id: 'g2', label: 'Non-perishable food (3-day)' },
      { id: 'g3', label: 'Flashlight & Powerbank' },
      { id: 'g4', label: 'First Aid Medical Box' },
      { id: 'g5', label: 'Battery-powered Radio' },
    ]
  },
  {
    id: 'med',
    title: 'Medical Supplies',
    icon: Stethoscope,
    color: 'blue',
    description: 'Critical health and hygiene essentials.',
    items: [
      { id: 'm1', label: 'Prescription Medications' },
      { id: 'm2', label: 'Antiseptic & Bandages' },
      { id: 'm3', label: 'Personal Hygiene Kit' },
      { id: 'm4', label: 'Spare Eyeglasses' },
    ]
  }
];

const ProcedureModal = ({ procedure, onClose }) => {
  if (!procedure) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl">
       <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0a0f1c] border border-white/10 w-full max-w-xl rounded-[2.5rem] p-10 space-y-8">
          <div className="flex justify-between items-start">
             <div className={`p-4 bg-${procedure.color}-500/10 rounded-2xl`}>
                <procedure.icon className={`h-8 w-8 text-${procedure.color}-500`} />
             </div>
             <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/40 transition-colors"><X className="h-6 w-6" /></button>
          </div>
          <div className="space-y-2">
             <h2 className="text-3xl font-black text-white tracking-tight">{procedure.title}</h2>
             <p className="text-slate-400 font-medium uppercase text-[10px] tracking-widest">Active Emergency Protocol</p>
          </div>
          <div className="space-y-4">
             {procedure.steps.map((step, i) => (
                <div key={i} className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 items-center group hover:bg-white/10 transition-colors">
                   <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0">{i+1}</div>
                   <p className="text-slate-200 font-medium">{step}</p>
                </div>
             ))}
          </div>
          <button onClick={onClose} className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black transition-all hover:scale-[1.02] active:scale-95 shadow-xl">Understood</button>
       </motion.div>
    </div>
  );
};

const SurvivalHub = () => {
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [sosActive, setSosActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const navigate = useNavigate();

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleNavigation = (shelterName) => {
    triggerToast(`Calculating safest route to ${shelterName}...`);
    setTimeout(() => {
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(shelterName + ' shelter')}`, '_blank');
    }, 1500);
  };

  const handleGlobalZones = () => {
    triggerToast('Accessing Global Safe Zone Database...');
    setTimeout(() => navigate('/dashboard/map'), 1500);
  };

  useEffect(() => {
    const saved = localStorage.getItem('disasterlink_survival_kit');
    if (saved) setCheckedItems(JSON.parse(saved));
  }, []);

  const toggleItem = (itemId) => {
    const updated = { ...checkedItems, [itemId]: !checkedItems[itemId] };
    setCheckedItems(updated);
    localStorage.setItem('disasterlink_survival_kit', JSON.stringify(updated));
  };

  const handleSOS = () => {
    if (sosActive) {
      setSosActive(false);
      setSosCountdown(0);
      return;
    }
    setSosActive(true);
    setSosCountdown(10);
  };

  useEffect(() => {
    let timer;
    if (sosActive && sosCountdown > 0) {
      timer = setInterval(() => setSosCountdown(c => c - 1), 1000);
    } else if (sosCountdown === 0 && sosActive) {
      // Simulate Signal Sent
    }
    return () => clearInterval(timer);
  }, [sosActive, sosCountdown]);

  const allValidItemIds = KITS.flatMap(kit => kit.items.map(i => i.id));
  const totalItems = allValidItemIds.length;
  const totalChecked = allValidItemIds.filter(id => checkedItems[id]).length;
  const overallReadiness = Math.min(100, Math.round((totalChecked / totalItems) * 100) || 0);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-12 relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-24 left-1/2 z-[200] bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl border border-white/10 font-black text-sm flex items-center gap-3"
          >
            <Activity className="h-5 w-5 text-blue-500 animate-pulse" /> {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* SOS Notification Bar */}
      <AnimatePresence>
        {sosActive && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="bg-red-600 text-white overflow-hidden rounded-3xl"
          >
            <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl animate-pulse"><Siren className="h-6 w-6" /></div>
                  <div>
                     <p className="font-black text-xl tracking-tight">SOS EMERGENCY SIGNAL BROADCASTING</p>
                     <p className="text-red-100 text-xs font-bold opacity-80 uppercase tracking-widest">Global Rescue Network Notified • Tracking Live GPS</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="text-4xl font-black tabular-nums">{sosCountdown}s</div>
                  <button onClick={() => setSosActive(false)} className="px-6 py-2 bg-white text-red-600 rounded-xl font-black text-xs uppercase transition-all hover:bg-red-50">Cancel Signal</button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Survival Hub</h1>
          <p className="text-slate-500 font-medium text-xl mt-2">Critical resources and emergency preparation center.</p>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
           <button 
             onClick={handleSOS}
             className={`px-8 py-4 ${sosActive ? 'bg-slate-900' : 'bg-red-600'} text-white rounded-[1.5rem] font-black tracking-tight flex items-center justify-center gap-3 shadow-2xl transition-all hover:scale-105 active:scale-95 group`}
           >
             <Siren className={`h-6 w-6 ${sosActive ? '' : 'group-hover:animate-bounce'}`} /> {sosActive ? 'Signal Active' : 'TRIGGER SOS'}
           </button>
           <div className="px-6 py-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[1.5rem] flex items-center gap-4 shadow-xl">
              <div className="relative w-12 h-12">
                 <svg className="w-12 h-12 transform -rotate-90">
                    <circle cx="24" cy="24" r="20" className="stroke-current text-slate-100 dark:text-slate-800" strokeWidth="4" fill="transparent" />
                    <circle cx="24" cy="24" r="20" className="stroke-current text-emerald-500" strokeWidth="4" fill="transparent" strokeDasharray="125.6" strokeDashoffset={125.6 - (125.6 * overallReadiness) / 100} strokeLinecap="round" />
                 </svg>
                 <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black">{overallReadiness}%</span>
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Readiness</p>
                 <p className="text-sm font-black text-slate-900 dark:text-white">Household Safe</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Readiness Checklist Column */}
        <div className="xl:col-span-2 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {KITS.map(kit => (
                <div key={kit.id} className="bg-white dark:bg-[#0a0f1c] rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden group">
                   <div className={`absolute top-0 right-0 w-40 h-40 bg-${kit.color}-500/5 rounded-bl-full blur-3xl group-hover:bg-${kit.color}-500/10 transition-all`}></div>
                   
                   <div className="flex items-center gap-5 mb-8">
                      <div className={`p-4 bg-${kit.color}-500/10 text-${kit.color}-500 rounded-2xl shadow-inner`}>
                         <kit.icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{kit.title}</h3>
                   </div>

                   <div className="space-y-3">
                      {kit.items.map(item => {
                         const isChecked = !!checkedItems[item.id];
                         return (
                            <button 
                              key={item.id} onClick={() => toggleItem(item.id)}
                              className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${isChecked ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 shadow-sm' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 hover:border-slate-300'}`}
                            >
                               <div className="flex items-center gap-4">
                                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${isChecked ? 'bg-emerald-500 text-white' : 'border-2 border-slate-300 dark:border-slate-700'}`}>
                                     {isChecked && <CheckSquare className="h-4 w-4" />}
                                  </div>
                                  <span className={`font-bold text-sm ${isChecked ? 'text-slate-900 dark:text-emerald-100 line-through opacity-60' : 'text-slate-600 dark:text-slate-300'}`}>{item.label}</span>
                               </div>
                               {isChecked && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                            </button>
                         );
                      })}
                   </div>
                </div>
              ))}
           </div>

           {/* Emergency Procedures Quick Grid */}
           <div className="bg-slate-900 rounded-[3rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-500/20 rounded-2xl"><Activity className="text-red-500 h-6 w-6" /></div>
                    <h3 className="text-2xl font-black text-white tracking-tight">Active Procedures</h3>
                 </div>
                 <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Live Guidance</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                 {PROCEDURES.map(proc => (
                   <button 
                     key={proc.id} onClick={() => setSelectedProcedure(proc)}
                     className="flex flex-col items-center p-8 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 hover:border-white/20 transition-all group"
                   >
                      <proc.icon className={`h-10 w-10 text-${proc.color}-500 mb-4 group-hover:scale-110 transition-transform`} />
                      <span className="font-black text-white tracking-tight">{proc.title}</span>
                      <ChevronRight className="h-4 w-4 text-white/20 mt-3 group-hover:text-white transition-colors" />
                   </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Shelters & Contacts Column */}
        <div className="space-y-8">
           <div className="bg-white dark:bg-[#0a0f1c] rounded-[3rem] p-8 border border-slate-100 dark:border-slate-800 shadow-xl h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                    <Navigation className="h-6 w-6 text-blue-500" /> Nearest Shelters
                 </h3>
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
              </div>

              <div className="space-y-6 flex-1">
                 {SHELTERS.map(shelter => (
                   <div key={shelter.id} className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-4 hover:border-blue-500/30 transition-all cursor-pointer group">
                      <div className="flex justify-between items-start">
                         <div>
                            <h4 className="font-black text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">{shelter.name}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{shelter.type}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-sm font-black text-slate-900 dark:text-white">{shelter.dist}</p>
                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{shelter.status}</p>
                         </div>
                      </div>
                      <div className="space-y-1.5">
                         <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
                            <span>Occupancy</span>
                            <span>{shelter.capacity}%</span>
                         </div>
                         <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${shelter.capacity}%` }} className={`h-full bg-${shelter.color}-500 rounded-full`}></motion.div>
                         </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleNavigation(shelter.name); }}
                        className="w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                      >
                        Get Navigation
                      </button>
                   </div>
                 ))}
              </div>

              <button 
                onClick={handleGlobalZones}
                className="w-full mt-8 py-5 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                 View All Global Safe Zones
              </button>
           </div>

           <div className="p-8 rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <h3 className="text-xl font-black tracking-tight flex items-center gap-2 relative z-10"><PhoneCall className="h-5 w-5" /> Emergency Support</h3>
              <div className="space-y-4 relative z-10">
                 <a href="tel:112" onClick={() => triggerToast('Dialing National Hotline (112)...')} className="p-4 bg-white/10 rounded-2xl flex justify-between items-center group cursor-pointer border border-white/5 hover:bg-white/20 transition-all">
                    <div><p className="text-[10px] font-black uppercase opacity-60">National Hotline</p><p className="text-xl font-black">112</p></div>
                    <div className="p-3 bg-white text-blue-600 rounded-xl group-hover:bg-blue-50 transition-colors shadow-lg"><PhoneCall className="h-5 w-5" /></div>
                 </a>
                 <a href="tel:102" onClick={() => triggerToast('Dialing Medical Dispatch (102)...')} className="p-4 bg-white/10 rounded-2xl flex justify-between items-center group cursor-pointer border border-white/5 hover:bg-white/20 transition-all">
                    <div><p className="text-[10px] font-black uppercase opacity-60">Medical Dispatch</p><p className="text-xl font-black">102</p></div>
                    <div className="p-3 bg-white text-blue-600 rounded-xl group-hover:bg-blue-50 transition-colors shadow-lg"><PlusCircle className="h-5 w-5" /></div>
                 </a>
              </div>
           </div>
        </div>
      </div>

      {/* Procedure Modal */}
      <AnimatePresence>
        {selectedProcedure && <ProcedureModal procedure={selectedProcedure} onClose={() => setSelectedProcedure(null)} />}
      </AnimatePresence>

    </div>
  );
};

export default SurvivalHub;
