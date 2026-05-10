import React, { useState, useRef, useEffect } from 'react';
import { Search, UserPlus, MapPin, Clock, AlertTriangle, ShieldCheck, Camera, X, CheckCircle2, Trash2, Mail, Smartphone, ArrowRight, Loader2, Info, Eye, History, User, MessageSquare, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_MISSING = [
  { id: 1, name: 'Emily Roberts', age: 8, gender: 'Female', lastSeen: 'Downtown Mall area', time: '4 hours ago', status: 'Missing', image: 'https://images.unsplash.com/photo-1517677129300-07b130802f46?auto=format&fit=crop&w=400&q=80', description: 'Wearing a red jacket and blue jeans.', reporterEmail: 'admin@disasterlink.com', reporterPhone: '9876543210', sightings: ['Seen near central fountain 2h ago'] },
  { id: 2, name: 'Arthur Pendelton', age: 74, gender: 'Male', lastSeen: 'Near River Side Park', time: '12 hours ago', status: 'Missing', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', description: 'Suffers from mild dementia. Wearing a grey sweater.', reporterEmail: 'admin@disasterlink.com', reporterPhone: '9876543210', sightings: [] },
  { id: 3, name: 'Sophia Chen', age: 24, gender: 'Female', lastSeen: 'University Campus', time: '1 day ago', status: 'Found', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', description: 'Student. Last contacted family during the storm.', reporterEmail: 'admin@disasterlink.com', reporterPhone: '9876543210', sightings: [] },
  { id: 4, name: 'Michael Dawson', age: 35, gender: 'Male', lastSeen: 'Highway 42 Evacuation Route', time: '5 hours ago', status: 'Missing', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', description: 'Driving a silver sedan. Lost cell service.', reporterEmail: 'admin@disasterlink.com', reporterPhone: '9876543210', sightings: [] },
];

const OTPInput = ({ value, onChange, onComplete }) => {
  return (
    <div className="flex gap-2 justify-center">
      {[...Array(4)].map((_, i) => (
        <input
          key={i}
          type="text"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => {
            const newVal = value.split('');
            newVal[i] = e.target.value.replace(/[^0-9]/g, '');
            const finalVal = newVal.join('');
            onChange(finalVal);
            if (e.target.value && i < 3) {
              e.target.nextSibling?.focus();
            }
          }}
          className="w-12 h-16 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl text-center text-2xl font-black text-slate-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
        />
      ))}
    </div>
  );
};

const PersonDetailModal = ({ person, isOpen, onClose }) => {
  if (!isOpen || !person) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-[#0a0f1c] border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
      >
        <div className="md:w-1/2 relative h-64 md:h-auto">
          <img src={person.image} className="absolute inset-0 w-full h-full object-cover" alt={person.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white">
             <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${person.status === 'Missing' ? 'bg-red-500' : 'bg-emerald-500'}`}>{person.status}</span>
             <h2 className="text-3xl font-black mt-2">{person.name}</h2>
          </div>
        </div>
        <div className="md:w-1/2 p-8 overflow-y-auto custom-scrollbar flex flex-col">
           <button onClick={onClose} className="self-end p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 transition-colors mb-4"><X className="h-5 w-5 text-slate-500" /></button>
           
           <div className="space-y-6 flex-1">
             <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Age</p>
                  <p className="font-black text-slate-900 dark:text-white">{person.age} Years</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Gender</p>
                  <p className="font-black text-slate-900 dark:text-white">{person.gender}</p>
                </div>
             </div>

             <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 mb-3"><MapPin className="h-4 w-4 text-red-500" /> Last Known Location</h4>
                <p className="text-slate-600 dark:text-slate-400 font-medium bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">{person.lastSeen}</p>
             </div>

             <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 mb-3"><History className="h-4 w-4 text-blue-500" /> Recent Sightings</h4>
                <div className="space-y-2">
                  {person.sightings && person.sightings.length > 0 ? person.sightings.map((s, i) => (
                    <div key={i} className="text-xs font-bold text-slate-500 bg-blue-50 dark:bg-blue-500/5 p-3 rounded-xl border border-blue-100 dark:border-blue-500/10">
                      • {s}
                    </div>
                  )) : (
                    <p className="text-xs text-slate-400 font-medium italic">No verified sightings yet.</p>
                  )}
                </div>
             </div>

             <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Reporter Identity</p>
                <div className="flex flex-col gap-2">
                   <div className="flex items-center gap-2 text-slate-500">
                      <Mail className="h-4 w-4" />
                      <span className="text-xs font-medium">{person.reporterEmail}</span>
                   </div>
                   <div className="flex items-center gap-2 text-slate-500">
                      <Smartphone className="h-4 w-4" />
                      <span className="text-xs font-medium">{person.reporterPhone}</span>
                   </div>
                </div>
             </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

const SightingModal = ({ person, isOpen, onClose, onSightingAdded }) => {
  const [step, setStep] = useState(1); // 1: Contact, 2: OTP, 3: Form
  const [method, setMethod] = useState('email');
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');

  if (!isOpen || !person) return null;

  const handleSendOTP = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setStep(2);
    }, 1500);
  };

  const handleVerifyOTP = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setStep(3);
    }, 1500);
  };

  const handleContactChange = (e) => {
    const val = e.target.value;
    if (method === 'mobile') {
      if (val.length <= 10 && /^\d*$/.test(val)) setContact(val);
    } else {
      setContact(val);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onSightingAdded(person.id, `${location}: ${details}`);
      setStep(1); setContact(''); setOtp(''); setLocation(''); setDetails('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-[#0a0f1c] border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-blue-50 dark:bg-blue-500/10">
          <h3 className="text-xl font-black text-blue-600 tracking-tight">Report Sighting</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500"><X className="h-5 w-5" /></button>
        </div>
        
        <div className="p-8">
           {step === 1 && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="text-center space-y-2">
                   <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <ShieldCheck className="h-8 w-8 text-blue-600" />
                   </div>
                   <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Identity Verification</h3>
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Ensuring reliable reports</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <button onClick={() => {setMethod('email'); setContact('');}} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${method === 'email' ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/5 text-blue-600' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}>
                      <Mail className="h-5 w-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Email</span>
                   </button>
                   <button onClick={() => {setMethod('mobile'); setContact('');}} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${method === 'mobile' ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/5 text-blue-600' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}>
                      <Smartphone className="h-5 w-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Mobile</span>
                   </button>
                </div>
                <div className="space-y-1">
                  <input 
                    type={method === 'email' ? 'email' : 'tel'} required value={contact} onChange={handleContactChange}
                    placeholder={method === 'email' ? 'Enter email' : 'Enter 10-digit mobile'}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>
                <button 
                  onClick={handleSendOTP} disabled={!contact || (method === 'mobile' && contact.length < 10) || verifying}
                  className="w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {verifying ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send OTP'}
                </button>
             </motion.div>
           )}

           {step === 2 && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="text-center space-y-2">
                   <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <KeyRound className="h-8 w-8 text-blue-600" />
                   </div>
                   <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Enter OTP</h3>
                   <p className="text-xs text-slate-500 font-bold">Code sent to {contact}</p>
                </div>
                <OTPInput value={otp} onChange={setOtp} />
                <button 
                  onClick={handleVerifyOTP} disabled={otp.length < 4 || verifying}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {verifying ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Verify & Continue'}
                </button>
                <button onClick={() => setStep(1)} className="w-full text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-blue-500">Change Contact Method</button>
             </motion.div>
           )}

           {step === 3 && (
             <form onSubmit={handleSubmit} className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                   <img src={person.image} className="w-12 h-12 rounded-xl object-cover" />
                   <div>
                     <p className="text-sm font-black text-slate-900 dark:text-white">{person.name}</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Subject</p>
                   </div>
                </div>
                <div>
                   <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Current Location</label>
                   <input 
                     type="text" required value={location} onChange={(e) => setLocation(e.target.value)}
                     className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                   />
                </div>
                <div>
                   <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Sighting Details</label>
                   <textarea 
                     required value={details} onChange={(e) => setDetails(e.target.value)}
                     className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none min-h-[100px]"
                   />
                </div>
                <button type="submit" disabled={submitting} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95">
                   {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                   {submitting ? 'Submitting sighting...' : 'Submit Sighting'}
                </button>
             </form>
           )}
        </div>
      </motion.div>
    </div>
  );
};

const ReportMissingModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Contact, 2: OTP, 3: Form
  const [method, setMethod] = useState('email'); 
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '', age: '', gender: 'Male', lastSeen: '', description: ''
  });

  if (!isOpen) return null;

  const handleSendOTP = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setStep(2);
    }, 1500);
  };

  const handleVerifyOTP = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setStep(3);
    }, 1500);
  };

  const handleContactChange = (e) => {
    const val = e.target.value;
    if (method === 'mobile') {
      if (val.length <= 10 && /^\d*$/.test(val)) setContact(val);
    } else {
      setContact(val);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPerson = {
      ...formData,
      id: Date.now(),
      time: 'Just now',
      status: 'Missing',
      image: imagePreview || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=400&q=80',
      reporterEmail: method === 'email' ? contact : 'verified@user.com',
      reporterPhone: method === 'mobile' ? contact : '9876543210',
      sightings: []
    };
    onSuccess(newPerson);
    onClose();
    setStep(1); setContact(''); setOtp(''); setMethod('email'); setImagePreview(null);
    setFormData({ name: '', age: '', gender: 'Male', lastSeen: '', description: '' });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-[#0a0f1c] border border-slate-200 dark:border-slate-800 w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-red-50 dark:bg-red-500/10">
          <h2 className="text-xl font-black text-red-600 tracking-tight">Broadcast Missing Alert</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors"><X className="h-6 w-6" /></button>
        </div>

        <div className="p-8">
           {step === 1 && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Verification Required</h3>
                  <p className="text-sm text-slate-500 font-medium">Protecting the database from unauthorized alerts.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <button onClick={() => {setMethod('email'); setContact('');}} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${method === 'email' ? 'border-red-500 bg-red-50 dark:bg-red-500/5 text-red-600' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}>
                      <Mail className="h-6 w-6" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Email</span>
                   </button>
                   <button onClick={() => {setMethod('mobile'); setContact('');}} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${method === 'mobile' ? 'border-red-500 bg-red-50 dark:bg-red-500/5 text-red-600' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}>
                      <Smartphone className="h-6 w-6" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Mobile</span>
                   </button>
                </div>
                <div className="space-y-1">
                   <input 
                     type={method === 'email' ? 'email' : 'tel'} required value={contact} onChange={handleContactChange}
                     placeholder={method === 'email' ? 'Enter email address' : 'Enter 10-digit mobile'}
                     className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 font-bold"
                   />
                </div>
                <button 
                  onClick={handleSendOTP} disabled={!contact || (method === 'mobile' && contact.length < 10) || verifying}
                  className="w-full py-4 bg-slate-900 dark:bg-red-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02]"
                >
                  {verifying ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send Verification OTP'}
                </button>
             </motion.div>
           )}

           {step === 2 && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 text-center">
                <div className="space-y-2">
                   <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <KeyRound className="h-8 w-8 text-red-600" />
                   </div>
                   <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Security Check</h3>
                   <p className="text-sm text-slate-500 font-medium">Code sent to {contact}</p>
                </div>
                <OTPInput value={otp} onChange={setOtp} />
                <button 
                  onClick={handleVerifyOTP} disabled={otp.length < 4 || verifying}
                  className="w-full py-4 bg-red-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-red-500/20"
                >
                  {verifying ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirm OTP'}
                </button>
                <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-red-500">Back to Contact</button>
             </motion.div>
           )}

           {step === 3 && (
             <form onSubmit={handleSubmit} className="space-y-6 max-h-[65vh] overflow-y-auto px-1 pr-6 custom-scrollbar scroll-smooth animate-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Subject Full Name</label>
                    <input 
                      type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Age</label>
                    <input 
                      type="number" required value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Gender</label>
                    <select 
                      value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-900 dark:text-white"
                    >
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Last Known Location</label>
                    <input 
                      type="text" required value={formData.lastSeen} onChange={(e) => setFormData({...formData, lastSeen: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Description</label>
                    <textarea 
                      required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white min-h-[80px]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Subject Photo</label>
                    <input type="file" hidden ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
                    <div 
                      onClick={() => fileInputRef.current.click()}
                      className="w-full aspect-video border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-all overflow-hidden"
                    >
                       {imagePreview ? (
                         <img src={imagePreview} className="w-full h-full object-cover" />
                       ) : (
                         <>
                           <Camera className="h-8 w-8 text-slate-400 mb-2" />
                           <span className="text-xs font-bold text-slate-500">Click to upload photo</span>
                         </>
                       )}
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-red-600 text-white rounded-2xl font-black shadow-xl shadow-red-500/20 hover:bg-red-500 transition-all active:scale-95">Broadcast Alert</button>
             </form>
           )}
        </div>
      </motion.div>
    </div>
  );
};

const MissingPersons = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [missingList, setMissingList] = useState(INITIAL_MISSING);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [sightingPerson, setSightingPerson] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [verifiedReporter, setVerifiedReporter] = useState(''); 

  const selectedPerson = missingList.find(p => p.id === selectedPersonId);

  const filteredPersons = missingList.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.lastSeen.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = (newPerson) => {
    setMissingList([newPerson, ...missingList]);
    setVerifiedReporter(newPerson.reporterEmail || newPerson.reporterPhone);
    setToastMessage('Alert Live on Database!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleDelete = (id, reporterEmail, reporterPhone) => {
    const isOwner = verifiedReporter === reporterEmail || verifiedReporter === reporterPhone || verifiedReporter === 'admin@disasterlink.com';
    if (isOwner) {
      if (window.confirm("Are you sure you want to delete this alert? This action is permanent.")) {
         setMissingList(missingList.filter(p => p.id !== id));
      }
    } else {
      alert("Verification Failed: Only the reporter or administrator can delete this record.");
    }
  };

  const handleSighting = (personId, details) => {
    setMissingList(prev => prev.map(p => {
       if (p.id === personId) {
          return { ...p, sightings: [details, ...p.sightings] };
       }
       return p;
    }));
    setToastMessage('Sighting recorded and updated!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 relative">
      
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Missing Persons Database</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-sm sm:text-lg tracking-tight">Cross-referenced registry for disaster-separated families.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-black py-4 px-8 rounded-2xl sm:rounded-[2rem] transition-all shadow-xl shadow-red-500/20 flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-95"
        >
          <UserPlus className="h-5 w-5" /> Report Missing
        </button>
      </div>

      <div className="bg-white dark:bg-[#0a0f1c] rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="relative mb-10 max-w-xl group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" placeholder="Search missing subjects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] focus:ring-4 focus:ring-blue-500/10 outline-none dark:text-white font-bold transition-all shadow-inner"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {filteredPersons.map(person => {
            const isOwner = verifiedReporter === person.reporterEmail || verifiedReporter === person.reporterPhone || verifiedReporter === 'admin@disasterlink.com';
            const lastSighting = person.sightings && person.sightings.length > 0 ? person.sightings[0] : null;

            return (
              <div key={person.id} className="rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden group hover:shadow-2xl transition-all bg-white dark:bg-slate-900/50 flex flex-col relative">
                
                <div className="h-56 relative overflow-hidden shrink-0">
                  <div className={`absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-lg ${person.status === 'Missing' ? 'bg-red-600 text-white' : 'bg-emerald-500 text-white'}`}>
                    {person.status}
                  </div>
                  {isOwner && (
                    <button 
                      onClick={() => handleDelete(person.id, person.reporterEmail, person.reporterPhone)}
                      className="absolute top-4 left-4 z-30 p-2.5 bg-red-600/90 backdrop-blur-md text-white rounded-xl hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100 shadow-xl transform hover:scale-110 active:scale-95"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <img src={person.image} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${person.status === 'Found' ? 'grayscale opacity-60' : ''}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-6 right-4 text-white">
                    <h3 className="text-xl font-black mb-1 tracking-tight">{person.name}</h3>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest opacity-80">
                       <span className="flex items-center gap-1"><User className="h-3 w-3" /> {person.age} Y/O</span>
                       <span>{person.gender}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="h-4 w-4 text-slate-400 mt-1" />
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">{person.lastSeen}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{person.time}</span>
                    </div>
                  </div>

                  {lastSighting && (
                    <div className="bg-blue-50 dark:bg-blue-500/10 p-3 rounded-xl border border-blue-100 dark:border-blue-500/20">
                       <p className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1 flex items-center gap-1"><History className="h-3 w-3" /> Latest Sighting</p>
                       <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 line-clamp-1">{lastSighting}</p>
                    </div>
                  )}

                  <div className="mt-auto space-y-3">
                    <button 
                      onClick={() => setSelectedPersonId(person.id)}
                      className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                        person.status === 'Missing' 
                          ? 'bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800' 
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {person.status === 'Missing' ? <><Info className="h-4 w-4" /> View Case File</> : <><ShieldCheck className="h-4 w-4" /> Safe & Reunited</>}
                    </button>
                    {person.status === 'Missing' && (
                       <button 
                         onClick={() => setSightingPerson(person)}
                         className="w-full py-3 border border-slate-200 dark:border-slate-800 text-slate-500 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 active:scale-95"
                       >
                          <Eye className="h-4 w-4" /> Report Sighting
                       </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <ReportMissingModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={handleAdd} 
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {selectedPersonId && (
          <PersonDetailModal 
            person={selectedPerson} 
            isOpen={!!selectedPersonId} 
            onClose={() => setSelectedPersonId(null)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sightingPerson && (
          <SightingModal 
            person={sightingPerson} 
            isOpen={!!sightingPerson} 
            onClose={() => setSightingPerson(null)} 
            onSightingAdded={handleSighting}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MissingPersons;
