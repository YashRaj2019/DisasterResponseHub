import { useState, useEffect } from 'react';
import { 
  ShieldAlert, MapPin, Activity, Loader2, Trash2, Crosshair, 
  Navigation, Clock, CheckCircle2, Siren, ArrowRight, X,
  HeartPulse, BedDouble, BatteryCharging, Droplets, Utensils,
  Radio
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import ReportEmergencyModal from '../../components/ReportEmergencyModal';

// Dummy Shelter Data for Modal
const SHELTERS_DATA = [
  {
    id: 'shelter-1',
    name: 'Central High School',
    distance: '1.2 miles away',
    type: 'Primary Safe Zone',
    status: 'Available',
    capacity: 150,
    maxCapacity: 500,
    statusColor: 'emerald',
    description: 'Designated as a Tier-1 relief center with reinforced structural integrity against seismic activity and Category 4 storms.',
    facilities: [
      { icon: HeartPulse, label: 'Advanced Trauma Triage' },
      { icon: BedDouble, label: 'Emergency Cot Housing' },
      { icon: BatteryCharging, label: '72hr Backup Generators' },
    ],
    supplies: [
      { icon: Droplets, label: '10,000 Gal Purified Water' },
      { icon: Utensils, label: 'MREs for 5 Days' }
    ]
  },
  {
    id: 'shelter-2',
    name: 'Community Center',
    distance: '3.4 miles away',
    type: 'Secondary Outpost',
    status: 'Near Full',
    capacity: 280,
    maxCapacity: 300,
    statusColor: 'orange',
    description: 'A secondary community shelter equipped primarily for minor injuries and short-term housing during localized floods.',
    facilities: [
      { icon: HeartPulse, label: 'Basic First Aid Station' },
      { icon: Radio, label: 'Ham Radio Comms Array' }
    ],
    supplies: [
      { icon: Droplets, label: '2,500 Gal Purified Water' },
      { icon: Utensils, label: 'MREs for 2 Days' }
    ]
  }
];

// Shelter Details Modal Component
const ShelterDetailsModal = ({ isOpen, onClose, shelter }) => {
  if (!isOpen || !shelter) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-[#0a0f1c] border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="p-6 border-b border-slate-800 flex justify-between items-start relative z-10">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl bg-${shelter.statusColor}-500/10 border border-${shelter.statusColor}-500/30 text-${shelter.statusColor}-400 shadow-[0_0_15px_rgba(var(--tw-colors-${shelter.statusColor}-500),0.2)]`}>
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">{shelter.name}</h2>
              <p className="text-slate-400 font-medium flex items-center gap-1.5 mt-1">
                <MapPin className="h-4 w-4" /> {shelter.distance} • {shelter.type}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800/80 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-8 relative z-10 space-y-8">
          <div>
            <p className="text-slate-300 text-lg leading-relaxed">{shelter.description}</p>
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Current Occupancy</h3>
              <span className={`text-lg font-black text-${shelter.statusColor}-400`}>
                {shelter.capacity} / {shelter.maxCapacity}
              </span>
            </div>
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-${shelter.statusColor}-500 rounded-full shadow-[0_0_10px_rgba(var(--tw-colors-${shelter.statusColor}-500),0.5)]`} 
                style={{ width: `${(shelter.capacity / shelter.maxCapacity) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Available Facilities</h3>
              <ul className="space-y-4">
                {shelter.facilities.map((fac, idx) => {
                  const Icon = fac.icon;
                  return (
                    <li key={idx} className="flex items-center gap-3 text-slate-300">
                      <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg"><Icon className="h-4 w-4" /></div>
                      <span className="font-medium text-sm">{fac.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Stockpiled Supplies</h3>
              <ul className="space-y-4">
                {shelter.supplies.map((sup, idx) => {
                  const Icon = sup.icon;
                  return (
                    <li key={idx} className="flex items-center gap-3 text-slate-300">
                      <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg"><Icon className="h-4 w-4" /></div>
                      <span className="font-medium text-sm">{sup.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <button 
            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(shelter.name)}`, '_blank')}
            className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all border border-slate-600 hover:border-slate-400 flex items-center justify-center gap-2"
          >
            <Navigation className="h-5 w-5" /> Get Directions
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Simulated Real-Time Tracking Modal Component
const RescueTrackingModal = ({ isOpen, onClose, report, startTime }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen && report && startTime) {
      const calculateProgress = () => {
        const now = Date.now();
        const elapsedSeconds = (now - startTime) / 1000;
        
        // Simulate a total travel time of 3 minutes (180 seconds) for realism
        const totalDuration = 180; 
        const currentProgress = Math.min(100, (elapsedSeconds / totalDuration) * 100);
        setProgress(currentProgress);
      };
      
      calculateProgress(); // Run immediately
      const interval = setInterval(calculateProgress, 1000); // Update every second to tie to real time
      return () => clearInterval(interval);
    }
  }, [isOpen, report]);

  if (!isOpen || !report) return null;

  const hasArrived = progress >= 100;
  // Calculate remaining ETA based on progress (max 3 mins)
  const etaMinutes = hasArrived ? 0 : Math.ceil((100 - progress) * 0.03);
  const distanceKm = hasArrived ? "0.0" : ((100 - progress) * 0.05).toFixed(1);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-4 text-emerald-400">
            <div className={`p-3 rounded-xl border ${hasArrived ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
              <Siren className={`h-6 w-6 ${hasArrived ? 'text-white' : 'animate-pulse'}`} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Live Rescue Tracking</h2>
              <p className="text-sm font-medium text-slate-400">Target: {report.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition-all border border-slate-600">
            Close Map
          </button>
        </div>

        {/* Map Simulation Area */}
        <div className="h-72 bg-[#050810] relative overflow-hidden flex items-center justify-center border-b border-slate-800">
          {/* Simulated Radar Grid */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
          
          {hasArrived && (
            <div className="absolute inset-0 bg-emerald-500/10 animate-pulse mix-blend-screen"></div>
          )}

          <div className="relative w-full max-w-lg h-32 flex items-center px-10">
            
            {/* Path Line Background */}
            <div className="absolute left-10 right-10 h-1.5 bg-slate-800 top-1/2 -translate-y-1/2 z-0 rounded-full overflow-hidden shadow-inner">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-600 via-emerald-500 to-emerald-400"
                style={{ width: `${progress}%` }}
              ></motion.div>
            </div>

            {/* Rescue Unit */}
            <div 
              className="absolute z-20 flex flex-col items-center transform -translate-x-1/2"
              style={{ left: `calc(40px + (100% - 80px) * ${progress / 100})` }}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 border-slate-900 transition-colors duration-500 ${hasArrived ? 'bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.8)]' : 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]'}`}>
                {hasArrived ? (
                  <CheckCircle2 className="h-7 w-7 text-white" />
                ) : (
                  <Navigation className="h-6 w-6 text-white transform rotate-45" />
                )}
              </div>
              <div className={`mt-3 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border shadow-lg ${hasArrived ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-slate-800 text-blue-400 border-blue-500/30'}`}>
                Alpha Team
              </div>
            </div>

            {/* Your Location */}
            <div className="absolute right-10 z-10 flex flex-col items-center transform translate-x-1/2">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 border-slate-900 transition-all ${hasArrived ? 'bg-emerald-500 scale-110' : 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]'}`}>
                {hasArrived ? <CheckCircle2 className="h-7 w-7 text-white" /> : <MapPin className="h-7 w-7 text-white" />}
              </div>
              <div className={`mt-3 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border shadow-lg ${hasArrived ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 opacity-0' : 'bg-slate-800 text-red-400 border-red-500/30'}`}>
                You
              </div>
            </div>

          </div>
        </div>

        {/* Status Panel */}
        <div className="p-8 bg-slate-900/80">
          {hasArrived ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center animate-in fade-in zoom-in duration-500">
              <h3 className="text-2xl font-black text-emerald-400 tracking-tight mb-2">RESCUE UNIT ALPHA HAS ARRIVED</h3>
              <p className="text-emerald-100/70 font-medium">Please make your presence known to the response team immediately. Do not move unless instructed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center text-center shadow-inner">
                <Clock className="h-6 w-6 text-blue-400 mb-3" />
                <span className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">ETA</span>
                <span className="text-3xl font-black text-white">{etaMinutes} <span className="text-lg text-slate-500">min</span></span>
              </div>
              <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center text-center shadow-inner">
                <Activity className="h-6 w-6 text-emerald-400 mb-3" />
                <span className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Distance</span>
                <span className="text-3xl font-black text-white">{distanceKm} <span className="text-lg text-slate-500">km</span></span>
              </div>
              <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center text-center shadow-inner">
                <ShieldAlert className="h-6 w-6 text-orange-400 mb-3 animate-pulse" />
                <span className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Status</span>
                <span className="text-2xl font-black text-orange-400">En Route</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const CitizenDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successToast, setSuccessToast] = useState(false);
  const [trackingReport, setTrackingReport] = useState(null);
  const [trackingStartTimes, setTrackingStartTimes] = useState({});
  const [selectedShelter, setSelectedShelter] = useState(null);

  const fetchReports = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiUrl}/api/emergencies`, {
        withCredentials: true
      });
      setReports(res.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleReportSuccess = () => {
    fetchReports();
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 6000);
  };

  const deleteReport = async (id) => {
    if (!window.confirm("Are you sure you want to cancel and delete this emergency report?")) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.delete(`${apiUrl}/api/emergencies/${id}`, { withCredentials: true });
      setReports(reports.filter(r => r._id !== id));
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('Failed to delete report. It may already be locked by central command.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Success Notification Toast */}
      <AnimatePresence>
        {successToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500/95 backdrop-blur-md text-white p-5 rounded-3xl flex items-start gap-4 shadow-[0_20px_50px_rgba(16,185,129,0.5)] border border-emerald-400 w-full max-w-lg"
          >
            <div className="p-3 bg-white/20 rounded-2xl shrink-0">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="font-black text-xl tracking-tight mb-1">Response Submitted!</h3>
              <p className="text-emerald-50 text-sm font-medium leading-relaxed">Your emergency has been registered. We are immediately connecting to the nearby response force headquarters. Rescue teams are being briefed.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Citizen Command Center</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-lg">Monitor your active requests and nearby safety infrastructure.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          
          {/* Main Action Area */}
          <div className="bg-gradient-to-br from-slate-900 to-[#0a0f1c] rounded-[2rem] p-8 md:p-12 border border-slate-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-gradient-to-l from-red-600/20 to-transparent transform rotate-12 blur-[100px] pointer-events-none group-hover:from-red-600/30 transition-all duration-700"></div>
            <div className="absolute top-10 right-10 opacity-10 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
              <ShieldAlert className="w-48 h-48 text-red-500" />
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-xs font-black tracking-widest uppercase mb-6 shadow-inner">
                <Activity className="h-3.5 w-3.5" /> Priority Access
              </div>
              <h2 className="text-5xl font-black mb-4 text-white tracking-tight leading-none">Need Immediate Help?</h2>
              <p className="text-slate-300 mb-10 max-w-xl text-lg leading-relaxed font-medium">
                Report an emergency to instantly alert nearby volunteer response forces and central headquarters. Medical facilities and rescue units will be dispatched.
              </p>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-[0_0_40px_rgba(220,38,38,0.4)] flex items-center text-lg active:scale-95 duration-200 border border-red-400/50 hover:shadow-[0_0_60px_rgba(220,38,38,0.6)]"
              >
                <Siren className="mr-3 h-7 w-7 animate-pulse" />
                Report Emergency Now
              </button>
            </div>
          </div>

          {/* Active Reports */}
          <div className="bg-white dark:bg-[#0a0f1c] rounded-[2rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <Crosshair className="text-blue-500 h-7 w-7" />
                Your Active Reports
              </h3>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                <Loader2 className="animate-spin h-12 w-12 text-blue-500 mb-4" />
                <span className="font-bold text-lg">Syncing dispatch records...</span>
              </div>
            ) : reports.length > 0 ? (
              <div className="space-y-4">
                <AnimatePresence>
                  {reports.map((report) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={report._id} 
                      className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 group hover:bg-white dark:hover:bg-slate-800 transition-all hover:shadow-2xl hover:-translate-y-1"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{report.title}</h4>
                          <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border ${
                            report.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 
                            report.status === 'In Progress' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' : 
                            'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
                          }`}>
                            {report.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium">
                          <Clock className="h-4 w-4" />
                          {new Date(report.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                        {/* Live Tracking Button */}
                        {(report.status === 'Reported' || report.status === 'In Progress') && (
                          <button 
                            onClick={() => {
                              if (!trackingStartTimes[report._id]) {
                                setTrackingStartTimes(prev => ({ ...prev, [report._id]: Date.now() }));
                              }
                              setTrackingReport(report);
                            }}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-blue-500/10 hover:bg-blue-500 text-blue-600 dark:text-blue-400 hover:text-white rounded-xl font-black text-sm transition-all border border-blue-500/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                          >
                            <Navigation className="h-4 w-4" /> Track Rescue
                          </button>
                        )}
                        
                        {/* Delete Button */}
                        <button 
                          onClick={() => deleteReport(report._id)}
                          className="flex items-center justify-center p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-xl transition-all border border-transparent hover:border-red-500/30"
                          title="Cancel/Delete Report"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-800/20 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 border-dashed">
                <CheckCircle2 className="h-20 w-20 text-emerald-500/30 mx-auto mb-5" />
                <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">No Active Emergencies</h4>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-lg">You have no active emergency reports. If you need immediate assistance, use the red priority button above.</p>
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-1 space-y-8">
          {/* Nearby Shelters Mini View */}
          <div className="bg-white dark:bg-[#0a0f1c] rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-bl-full pointer-events-none blur-2xl"></div>
            
            <div className="flex items-center mb-8 gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-600 dark:text-blue-400 shadow-inner">
                <MapPin className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Safety Shelters</h3>
                <p className="text-sm text-slate-500 font-medium">Click for facility details</p>
              </div>
            </div>
            
            <div className="space-y-4 relative z-10">
              {SHELTERS_DATA.map((shelter) => (
                <div 
                  key={shelter.id}
                  onClick={() => setSelectedShelter(shelter)}
                  className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-blue-500/50 hover:bg-slate-800 transition-all cursor-pointer group shadow-sm hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-black text-slate-900 dark:text-white text-lg group-hover:text-blue-400 transition-colors tracking-tight">{shelter.name}</h4>
                    <ArrowRight className="h-5 w-5 text-slate-500 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> {shelter.distance}
                  </p>
                  <div className={`inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-${shelter.statusColor}-600 dark:text-${shelter.statusColor}-400 bg-${shelter.statusColor}-100 dark:bg-${shelter.statusColor}-500/10 px-3 py-1.5 rounded-lg border border-${shelter.statusColor}-500/20`}>
                    <span className={`w-2 h-2 rounded-full bg-${shelter.statusColor}-500 ${shelter.statusColor === 'emerald' ? 'animate-pulse' : ''}`}></span>
                    {shelter.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ReportEmergencyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleReportSuccess}
      />

      <RescueTrackingModal 
        isOpen={!!trackingReport}
        onClose={() => setTrackingReport(null)}
        report={trackingReport}
        startTime={trackingReport ? trackingStartTimes[trackingReport._id] : null}
      />

      <ShelterDetailsModal
        isOpen={!!selectedShelter}
        onClose={() => setSelectedShelter(null)}
        shelter={selectedShelter}
      />

    </div>
  );
};

export default CitizenDashboard;
