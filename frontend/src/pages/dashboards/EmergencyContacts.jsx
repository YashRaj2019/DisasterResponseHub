import React, { useState } from 'react';
import { Phone, Shield, HeartPulse, Flame, Building, Search, Building2, Droplets, Heart, PawPrint, Copy, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CONTACTS = [
  { id: 1, name: 'National Emergency', number: '112', type: 'National', category: 'Police & Rescue', icon: Shield, color: 'blue', desc: 'General multi-agency dispatch for immediate life-threatening situations.' },
  { id: 2, name: 'Ambulance & Medical', number: '102', type: 'National', category: 'Medical', icon: HeartPulse, color: 'emerald', desc: 'Immediate trauma dispatch and advanced life support.' },
  { id: 3, name: 'Fire Department', number: '101', type: 'National', category: 'Fire', icon: Flame, color: 'red', desc: 'Structural fires, hazardous materials, and technical rescue.' },
  { id: 4, name: 'Disaster Management (NDMA)', number: '1078', type: 'National', category: 'Disaster', icon: Shield, color: 'orange', desc: 'Federal coordination for mass casualty and severe weather.' },
  { id: 5, name: 'Coast Guard & Water Rescue', number: '1094', type: 'National', category: 'Rescue', icon: Droplets, color: 'cyan', desc: 'Maritime distress, flood evacuation, and swift-water rescue.' },
  { id: 6, name: 'Mental Health Crisis Line', number: '988', type: 'National', category: 'Medical', icon: Heart, color: 'purple', desc: 'Immediate psychological support during disaster trauma.' },
  { id: 7, name: 'Poison Control Center', number: '1-800-222-1222', type: 'National', category: 'Medical', icon: Shield, color: 'emerald', desc: 'Chemical spills, toxic gas exposure, and venomous bites.' },
  { id: 8, name: 'Animal Rescue Team', number: '+1 (555) 019-4432', type: 'Local', category: 'Rescue', icon: PawPrint, color: 'amber', desc: 'Evacuation and sheltering for pets and livestock.' },
  { id: 9, name: 'Central High School Shelter', number: '+1 (555) 019-2834', type: 'Local', category: 'Shelter', icon: Building, color: 'indigo', desc: 'Capacity: 500. Currently accepting displaced citizens.' },
  { id: 10, name: 'Community Center Shelter', number: '+1 (555) 019-8821', type: 'Local', category: 'Shelter', icon: Building2, color: 'teal', desc: 'Capacity: 250. Medical triage available on-site.' },
];

const getThemeClasses = (color, expanded, calling) => {
  const themes = {
    blue: {
      cardBorder: expanded ? 'border-blue-400 dark:border-blue-500/50 shadow-2xl scale-[1.02]' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg',
      blurBg: expanded ? 'bg-blue-500/20' : 'bg-blue-500/5 group-hover:bg-blue-500/10',
      iconBox: expanded ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
      btnDefault: calling ? 'bg-slate-900 text-white dark:bg-slate-800' : 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20'
    },
    emerald: {
      cardBorder: expanded ? 'border-emerald-400 dark:border-emerald-500/50 shadow-2xl scale-[1.02]' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg',
      blurBg: expanded ? 'bg-emerald-500/20' : 'bg-emerald-500/5 group-hover:bg-emerald-500/10',
      iconBox: expanded ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      btnDefault: calling ? 'bg-slate-900 text-white dark:bg-slate-800' : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
    },
    red: {
      cardBorder: expanded ? 'border-red-400 dark:border-red-500/50 shadow-2xl scale-[1.02]' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg',
      blurBg: expanded ? 'bg-red-500/20' : 'bg-red-500/5 group-hover:bg-red-500/10',
      iconBox: expanded ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400',
      btnDefault: calling ? 'bg-slate-900 text-white dark:bg-slate-800' : 'bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20'
    },
    orange: {
      cardBorder: expanded ? 'border-orange-400 dark:border-orange-500/50 shadow-2xl scale-[1.02]' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg',
      blurBg: expanded ? 'bg-orange-500/20' : 'bg-orange-500/5 group-hover:bg-orange-500/10',
      iconBox: expanded ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400',
      btnDefault: calling ? 'bg-slate-900 text-white dark:bg-slate-800' : 'bg-orange-50 hover:bg-orange-100 dark:bg-orange-500/10 dark:hover:bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20'
    },
    cyan: {
      cardBorder: expanded ? 'border-cyan-400 dark:border-cyan-500/50 shadow-2xl scale-[1.02]' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg',
      blurBg: expanded ? 'bg-cyan-500/20' : 'bg-cyan-500/5 group-hover:bg-cyan-500/10',
      iconBox: expanded ? 'bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
      btnDefault: calling ? 'bg-slate-900 text-white dark:bg-slate-800' : 'bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-500/10 dark:hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20'
    },
    purple: {
      cardBorder: expanded ? 'border-purple-400 dark:border-purple-500/50 shadow-2xl scale-[1.02]' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg',
      blurBg: expanded ? 'bg-purple-500/20' : 'bg-purple-500/5 group-hover:bg-purple-500/10',
      iconBox: expanded ? 'bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
      btnDefault: calling ? 'bg-slate-900 text-white dark:bg-slate-800' : 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-500/10 dark:hover:bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20'
    },
    amber: {
      cardBorder: expanded ? 'border-amber-400 dark:border-amber-500/50 shadow-2xl scale-[1.02]' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg',
      blurBg: expanded ? 'bg-amber-500/20' : 'bg-amber-500/5 group-hover:bg-amber-500/10',
      iconBox: expanded ? 'bg-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
      btnDefault: calling ? 'bg-slate-900 text-white dark:bg-slate-800' : 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
    },
    indigo: {
      cardBorder: expanded ? 'border-indigo-400 dark:border-indigo-500/50 shadow-2xl scale-[1.02]' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg',
      blurBg: expanded ? 'bg-indigo-500/20' : 'bg-indigo-500/5 group-hover:bg-indigo-500/10',
      iconBox: expanded ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      btnDefault: calling ? 'bg-slate-900 text-white dark:bg-slate-800' : 'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20'
    },
    teal: {
      cardBorder: expanded ? 'border-teal-400 dark:border-teal-500/50 shadow-2xl scale-[1.02]' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg',
      blurBg: expanded ? 'bg-teal-500/20' : 'bg-teal-500/5 group-hover:bg-teal-500/10',
      iconBox: expanded ? 'bg-teal-500 text-white shadow-[0_0_20px_rgba(20,184,166,0.4)]' : 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400',
      btnDefault: calling ? 'bg-slate-900 text-white dark:bg-slate-800' : 'bg-teal-50 hover:bg-teal-100 dark:bg-teal-500/10 dark:hover:bg-teal-500/20 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20'
    }
  };
  return themes[color];
};

const ContactCard = ({ contact }) => {
  const Icon = contact.icon;
  const [calling, setCalling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const theme = getThemeClasses(contact.color, expanded, calling);

  const handleCall = () => {
    setCalling(true);
    setTimeout(() => {
      window.open(`tel:${contact.number}`, '_self');
      setCalling(false);
    }, 1200);
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(contact.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      layout
      onClick={() => setExpanded(!expanded)}
      className={`bg-white dark:bg-[#0a0f1c] rounded-3xl p-6 border transition-all duration-300 cursor-pointer overflow-hidden relative group ${theme.cardBorder}`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full pointer-events-none transition-all duration-500 blur-2xl ${theme.blurBg}`}></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-2xl shadow-inner transition-colors ${theme.iconBox}`}>
          <Icon className="h-6 w-6" />
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${contact.type === 'National' ? 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' : 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'}`}>
          {contact.type}
        </span>
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{contact.name}</h3>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{contact.category}</p>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="relative z-10"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 mb-2 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              {contact.desc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 flex gap-2 relative z-10">
        <button 
          onClick={(e) => { e.stopPropagation(); handleCall(); }}
          disabled={calling}
          className={`flex-1 py-3 px-4 rounded-xl font-black flex items-center justify-center gap-2 transition-all shadow-sm ${theme.btnDefault}`}
        >
          {calling ? <Loader2 className="h-5 w-5 animate-spin" /> : <Phone className="h-5 w-5" />}
          {calling ? 'Connecting...' : contact.number}
        </button>

        <button 
          onClick={handleCopy}
          className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 transition-colors"
          title="Copy Number"
        >
          {copied ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
        </button>
      </div>
    </motion.div>
  );
};

const EmergencyContacts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredContacts = CONTACTS.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || contact.number.includes(searchTerm);
    const matchesFilter = filter === 'All' || contact.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Emergency Directory</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-lg">One-click access to critical response forces and local facilities.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0a0f1c] rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search services or numbers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white font-medium transition-all"
            />
          </div>
          <div className="flex bg-slate-50 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            {['All', 'National', 'Local'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  filter === f 
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredContacts.map(contact => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </AnimatePresence>
          
          {filteredContacts.length === 0 && (
             <div className="col-span-full py-12 text-center text-slate-500 font-medium text-lg border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
               No emergency contacts found for "{searchTerm}"
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyContacts;
