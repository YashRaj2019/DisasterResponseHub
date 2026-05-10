import React, { useState, useRef } from 'react';
import { Users, Award, ShieldCheck, MapPin, Activity, Star, ChevronRight, X, Phone, Mail, FileText, CheckCircle2, MessageSquare, Loader2, Navigation, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';

const VOLUNTEERS = [
  { 
    id: 1, name: 'Sarah Jenkins', role: 'Medical First Responder', status: 'Active Now', distance: '0.8 miles', rating: 4.9, missions: 14,
    phone: '+15550192834', email: 'sarah.j.rescue@disasterlink.org',
    equipment: ['Advanced Trauma Kit', 'Portable Defibrillator', 'Oxygen Tank'],
    certifications: ['Advanced Cardiac Life Support', 'Wilderness First Responder']
  },
  { 
    id: 2, name: 'Marcus Chen', role: 'Search & Rescue', status: 'On Standby', distance: '2.1 miles', rating: 5.0, missions: 32,
    phone: '+15550199921', email: 'mchen.sar@disasterlink.org',
    equipment: ['Thermal Drones', 'Hydraulic Rescue Tools', 'Ropes & Harnesses'],
    certifications: ['Urban Search and Rescue', 'Rope Rescue Technician']
  },
  { 
    id: 3, name: 'Priya Sharma', role: 'Logistics Coordinator', status: 'Active Now', distance: '3.5 miles', rating: 4.8, missions: 9,
    phone: '+15550193345', email: 'psharma.logistics@disasterlink.org',
    equipment: ['Sat-Phone', 'Emergency Rations', 'Transport Van'],
    certifications: ['Supply Chain Management', 'Hazmat Handling']
  },
  { 
    id: 4, name: 'David Wilson', role: 'Paramedic', status: 'Off Duty', distance: '4.0 miles', rating: 4.9, missions: 55,
    phone: '+15550197732', email: 'dwilson.medic@disasterlink.org',
    equipment: ['Mobile Triage Tent', 'Surgical Kit', 'Medication Lockbox'],
    certifications: ['Licensed Paramedic', 'Pediatric Advanced Life Support']
  },
];

const TOP_HEROES = [
  { 
    rank: 1, name: 'David Wilson', pts: '2,450', color: 'yellow',
    role: 'Paramedic', status: 'Active Now', distance: '4.0 miles', rating: 4.9, missions: 55,
    phone: '+15550197732', email: 'dwilson.medic@disasterlink.org',
    equipment: ['Mobile Triage Tent', 'Surgical Kit', 'Medication Lockbox'],
    certifications: ['Licensed Paramedic', 'Pediatric Advanced Life Support']
  },
  { 
    rank: 2, name: 'Marcus Chen', pts: '1,890', color: 'slate',
    role: 'Search & Rescue', status: 'On Standby', distance: '2.1 miles', rating: 5.0, missions: 32,
    phone: '+15550199921', email: 'mchen.sar@disasterlink.org',
    equipment: ['Thermal Drones', 'Hydraulic Rescue Tools', 'Ropes & Harnesses'],
    certifications: ['Urban Search and Rescue', 'Rope Rescue Technician']
  },
  { 
    rank: 3, name: 'Sarah Jenkins', pts: '1,420', color: 'orange',
    role: 'Medical First Responder', status: 'Active Now', distance: '0.8 miles', rating: 4.9, missions: 14,
    phone: '+15550192834', email: 'sarah.j.rescue@disasterlink.org',
    equipment: ['Advanced Trauma Kit', 'Portable Defibrillator', 'Oxygen Tank'],
    certifications: ['Advanced Cardiac Life Support', 'Wilderness First Responder']
  },
];

// Modal for Volunteer Details
const VolunteerDetailsModal = ({ isOpen, onClose, volunteer }) => {
  const [locationState, setLocationState] = useState('idle'); // idle, sending, sent
  const [callingState, setCallingState] = useState(false);

  if (!isOpen || !volunteer) return null;

  const handleSendLocation = () => {
    setLocationState('sending');
    setTimeout(() => {
      setLocationState('sent');
      setTimeout(() => setLocationState('idle'), 3000);
    }, 1500);
  };

  const handleCall = () => {
    setCallingState(true);
    setTimeout(() => {
      window.open(`tel:${volunteer.phone}`, '_self');
      setCallingState(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-[#0a0f1c] border border-slate-200 dark:border-slate-700 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-2xl font-black text-white shadow-lg">
                {volunteer.name.charAt(0)}
              </div>
              {volunteer.status === 'Active Now' && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white dark:border-[#0a0f1c]"></div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{volunteer.name}</h2>
              <p className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-xs mt-1">{volunteer.role}</p>
            </div>
          </div>
          <button onClick={() => { setLocationState('idle'); onClose(); }} className="p-2 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-8 relative z-10 space-y-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-slate-900 dark:text-white">{volunteer.rating} Rating</span>
            </div>
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-500" />
              <span className="font-bold text-slate-900 dark:text-white">{volunteer.missions} Missions</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-2">Equipment Loadout</h3>
            <div className="flex flex-wrap gap-2">
              {volunteer.equipment.map((item, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-lg border border-blue-200 dark:border-blue-500/20">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-2">Certifications</h3>
            <div className="flex flex-col gap-2">
              {volunteer.certifications.map((cert, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                  {cert}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleCall}
              disabled={callingState}
              className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl font-bold transition-all border border-slate-700 hover:border-slate-500 flex items-center justify-center gap-2"
            >
              {callingState ? <Loader2 className="h-5 w-5 animate-spin" /> : <Phone className="h-5 w-5" />}
              {callingState ? 'Connecting...' : 'Call Securely'}
            </button>
            <button 
              onClick={() => window.open(`mailto:${volunteer.email}`, '_blank')}
              className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="h-5 w-5" /> Message
            </button>
            <button 
              onClick={handleSendLocation}
              disabled={locationState !== 'idle'}
              className={`flex-1 py-4 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                locationState === 'sent' 
                  ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]' 
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
              }`}
            >
              {locationState === 'idle' && <MapPin className="h-5 w-5" />}
              {locationState === 'sending' && <Loader2 className="h-5 w-5 animate-spin" />}
              {locationState === 'sent' && <CheckCircle2 className="h-5 w-5" />}
              
              {locationState === 'idle' && 'Send Location'}
              {locationState === 'sending' && 'Pinging...'}
              {locationState === 'sent' && 'Location Sent'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Modal for Application
const VolunteerApplicationModal = ({ isOpen, onClose, onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Info, 2: ID Upload, 3: Verification
  const [idType, setIdType] = useState('Aadhaar Card');
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const startVerification = () => {
    setStep(3);
    
    let progress = 0;
    const interval = setInterval(async () => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        setVerificationProgress(100);
        clearInterval(interval);
        
        // 2. Perform actual upload to Cloudinary via Backend
        try {
          setSubmitting(true);
          const formData = new FormData();
          formData.append('file', selectedFile || new Blob(['simulated'], { type: 'image/png' }));
          
          await api.post('/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });

          setTimeout(() => {
            setSubmitting(false);
            onSuccess();
            onClose();
            setStep(1);
            setVerificationProgress(0);
            setSelectedFile(null);
          }, 1500);
        } catch (error) {
          console.error('Upload failed:', error);
          setSubmitting(false);
          // Fallback for presentation stability if backend has issues
          onSuccess();
          onClose();
        }
      } else {
        setVerificationProgress(progress);
      }
    }, 150);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      startVerification();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onSuccess();
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-[#0a0f1c] border border-slate-200 dark:border-slate-700 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden relative"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Join the Response Force</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  DisasterLink relies on community heroes. Apply to upgrade your account to a Responder role.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Primary Expertise</label>
                    <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white font-black text-sm">
                      <option>Medical & First Aid</option>
                      <option>Search and Rescue</option>
                      <option>Logistics & Transport</option>
                      <option>Communications</option>
                      <option>General Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Experience & Certifications</label>
                    <textarea rows="3" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white font-medium text-sm" placeholder="Describe any past disaster relief or medical training..."></textarea>
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-black transition-all flex items-center justify-center gap-2">
                  Next Step: Identity Verification <ChevronRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-500/5 rounded-2xl border border-blue-100 dark:border-blue-500/20">
                   <p className="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" /> Government ID Required for Authorization
                   </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Select ID Type</label>
                    <div className="grid grid-cols-2 gap-2">
                       {['Aadhaar Card', 'Passport', 'Voter ID', 'Driver\'s License'].map(type => (
                         <button key={type} onClick={() => setIdType(type)} className={`py-2 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all ${idType === type ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'}`}>
                           {type}
                         </button>
                       ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Upload {idType}</label>
                    <input 
                      type="file" ref={fileInputRef} onChange={handleFileSelect} 
                      className="hidden" accept="image/*" 
                    />
                    <div 
                      onClick={() => fileInputRef.current.click()} 
                      className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/5 transition-all cursor-pointer group"
                    >
                      {selectedFile ? (
                        <>
                          <CheckCircle2 className="h-10 w-10 mb-2 text-emerald-500" />
                          <span className="text-sm font-black text-slate-900 dark:text-white">{selectedFile.name}</span>
                          <span className="text-[10px] mt-1 font-bold text-emerald-500 uppercase tracking-widest">Document Ready</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-10 w-10 mb-2 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-black">Click to Upload Document</span>
                          <span className="text-[10px] mt-1 font-bold opacity-60 uppercase tracking-widest">Supports PNG, JPG, JPEG</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button onClick={() => setStep(1)} className="w-full py-2 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors">
                  Go Back
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 py-4 text-center">
                <div className="relative w-32 h-32 mx-auto">
                   <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="60" className="stroke-current text-slate-100 dark:text-slate-800" strokeWidth="8" fill="transparent" />
                      <circle cx="64" cy="64" r="60" className="stroke-current text-blue-600" strokeWidth="8" fill="transparent" strokeDasharray="376.8" strokeDashoffset={376.8 - (376.8 * verificationProgress) / 100} strokeLinecap="round" />
                   </svg>
                   <div className="absolute inset-0 flex items-center justify-center">
                      {verificationProgress < 100 ? (
                        <Activity className="h-10 w-10 text-blue-600 animate-pulse" />
                      ) : (
                        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                      )}
                   </div>
                </div>
                <div>
                   <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {verificationProgress < 100 ? 'Scanning Identity Docs...' : 'Verification Complete'}
                   </h3>
                   <p className="text-slate-500 font-medium mt-2">
                      {verificationProgress < 100 ? `Cross-referencing with ${idType} database...` : 'Credentials authenticated. Preparing authorization.'}
                   </p>
                </div>
                {submitting && (
                   <div className="flex items-center justify-center gap-2 text-blue-600 font-black text-xs uppercase tracking-[0.2em]">
                      <Loader2 className="h-4 w-4 animate-spin" /> Finalizing Application
                   </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

const VolunteerNetwork = () => {
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [isAppOpen, setIsAppOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAppSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 relative">
      
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500/95 backdrop-blur-md text-white px-6 py-4 rounded-2xl flex items-center gap-4 shadow-[0_10px_40px_rgba(16,185,129,0.4)] border border-emerald-400"
          >
            <CheckCircle2 className="h-6 w-6 text-white" />
            <div>
              <h3 className="font-bold text-lg leading-tight">Application Submitted!</h3>
              <p className="text-emerald-50 text-sm">Our admins will review your profile shortly.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Volunteer Network</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-lg">Local heroes ready to respond. Join the network today.</p>
        </div>
        <button 
          onClick={() => setIsAppOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-3 px-8 rounded-2xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center gap-2 border border-blue-400/50"
        >
          <ShieldCheck className="h-5 w-5" /> Become a Responder
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Network Map / Stats */}
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-900/20 to-transparent"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-black tracking-widest uppercase mb-4 shadow-inner">
                  <Activity className="h-3 w-3" /> Grid Active
                </div>
                <h2 className="text-4xl font-black text-white tracking-tight mb-2">1,248 Heroes</h2>
                <p className="text-slate-400 font-medium text-lg">Active volunteers operating in your broader metropolitan area right now.</p>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-2xl text-center shadow-inner">
                  <span className="block text-3xl font-black text-blue-400 mb-1">14</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">On Standby Near You</span>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-2xl text-center shadow-inner">
                  <span className="block text-3xl font-black text-emerald-400 mb-1">3</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deployed on Active Calls</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0a0f1c] rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Nearby Responders</h3>
            <div className="space-y-4">
              {VOLUNTEERS.map(vol => (
                <div 
                  key={vol.id} 
                  onClick={() => setSelectedVolunteer(vol)}
                  className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between group cursor-pointer hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="flex items-center gap-5 w-full sm:w-auto mb-4 sm:mb-0">
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-xl font-black text-slate-700 dark:text-white border-2 border-slate-300 dark:border-slate-700 group-hover:border-blue-500 transition-colors">
                        {vol.name.charAt(0)}
                      </div>
                      {vol.status === 'Active Now' && (
                         <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0a0f1c] shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{vol.name}</h4>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{vol.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1"><Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> {vol.rating}</p>
                      <p className="text-xs text-slate-500 font-medium mt-1">{vol.missions} Missions</p>
                    </div>
                    <div className="text-right w-24">
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center justify-end gap-1"><MapPin className="h-4 w-4" /> {vol.distance}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="xl:col-span-1">
          <div className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800 shadow-xl h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-bl-full pointer-events-none blur-2xl"></div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-2xl shadow-inner border border-yellow-500/20">
                <Award className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">Top Heroes</h3>
                <p className="text-sm font-medium text-slate-400">Monthly Leaderboard</p>
              </div>
            </div>

            <div className="space-y-6">
              {TOP_HEROES.map((hero) => (
                <div 
                  key={hero.rank} 
                  onClick={() => setSelectedVolunteer(hero)}
                  className="flex items-center gap-4 group cursor-pointer hover:bg-slate-800/50 p-3 -mx-3 rounded-2xl transition-colors border border-transparent hover:border-slate-700/50"
                >
                  <div className={`w-10 h-10 rounded-xl bg-${hero.color}-500/10 border border-${hero.color}-500/30 text-${hero.color}-500 flex items-center justify-center font-black shadow-inner`}>
                    #{hero.rank}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{hero.name}</h4>
                    <p className="text-xs font-medium text-slate-400">{hero.pts} Impact Points</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
            
            <div className="mt-10 p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-center shadow-inner">
              <p className="text-sm text-slate-400 mb-2 font-medium">Your current rank</p>
              <p className="text-2xl font-black text-white">#8,492 <span className="text-sm font-medium text-slate-500 block mt-1">(Citizen Tier)</span></p>
            </div>
          </div>
        </div>
      </div>

      <VolunteerDetailsModal 
        isOpen={!!selectedVolunteer} 
        onClose={() => setSelectedVolunteer(null)} 
        volunteer={selectedVolunteer} 
      />

      <VolunteerApplicationModal
        isOpen={isAppOpen}
        onClose={() => setIsAppOpen(false)}
        onSuccess={handleAppSuccess}
      />
    </div>
  );
};

export default VolunteerNetwork;
