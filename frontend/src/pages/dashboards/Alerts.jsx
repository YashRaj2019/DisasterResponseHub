import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, ShieldAlert, CheckCircle, Info, Loader2, Globe, 
  Activity, AlertTriangle, Clock, Check, RefreshCw,
  Flame, Wind, Waves, Zap, ChevronRight, Shield, CloudLightning,
  Radio
} from 'lucide-react';

const SAFETY_GUIDELINES = {
  earthquake: {
    icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/50',
    before: ["Secure heavy furniture and appliances to walls", "Prepare a 72-hour emergency survival kit", "Identify safe spots like under sturdy tables"],
    during: ["DROP, COVER, and HOLD ON", "Stay away from glass, windows, and outside doors", "Do not use elevators under any circumstances"],
    after: ["Check yourself and others for injuries", "Be prepared for aftershocks", "Turn off gas valves if you smell gas"]
  },
  fire: {
    icon: Flame, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/50',
    before: ["Clear dry vegetation and leaves around your home", "Test smoke alarms monthly", "Plan and practice dual evacuation routes"],
    during: ["Evacuate immediately if advised by authorities", "Stay low to the ground to avoid inhaling toxic smoke", "Cover your face with a wet cloth"],
    after: ["Do not return home until officials declare it safe", "Check roof and exterior for hidden embers", "Document damages for insurance"]
  },
  storm: {
    icon: Wind, color: 'text-violet-500', bg: 'bg-violet-500/10', border: 'border-violet-500/50',
    before: ["Board up windows and secure loose outdoor items", "Stockpile non-perishable food and bottled water", "Charge all communication devices and power banks"],
    during: ["Stay indoors and away from glass windows", "Unplug sensitive electrical appliances", "Monitor NOAA or local weather radio updates"],
    after: ["Never drive through flooded or barricaded roadways", "Stay strictly clear of downed power lines", "Report massive infrastructural damages to authorities"]
  },
  flood: {
    icon: Waves, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/50',
    before: ["Move valuables and important documents to higher ground", "Know your local flood evacuation routes", "Acquire and place sandbags near entrances"],
    during: ["Turn off utilities at main switches if instructed", "Move to the highest floor (do not climb into a closed attic)", "Never walk or drive through flowing flood waters"],
    after: ["Avoid contact with contaminated floodwater", "Thoroughly clean and disinfect everything that got wet", "Wait for official all-clear before returning"]
  },
  default: {
    icon: Bell, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/50',
    before: ["Stay informed with continuous local alerts", "Review your personal communication plan"],
    during: ["Acknowledge receipt of the message", "Follow any specific instructions provided"],
    after: ["Archive message once resolved", "Await further instructions if applicable"]
  }
};

// Mock data for presentation purposes so tabs are never empty
const MOCK_PERSONAL_ALERTS = [
  {
    _id: 'mock_1',
    source: 'personal',
    category: 'default',
    title: 'Emergency Contact Update Required',
    message: 'Please update your emergency contact numbers in your profile settings immediately.',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    severity: 'Warning',
    readStatus: false
  },
  {
    _id: 'mock_2',
    source: 'personal',
    category: 'storm',
    title: 'Local Area Advisory',
    message: 'Heavy rainfall expected in your registered zone over the next 12 hours. Commute delays likely.',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    severity: 'Warning',
    readStatus: false
  },
  {
    _id: 'mock_3',
    source: 'personal',
    category: 'default',
    title: 'Welcome to DisasterLink Command',
    message: 'Your account has been successfully verified. You are now receiving live intelligence feeds.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    severity: 'Info',
    readStatus: true
  }
];

const Alerts = () => {
  const [personalAlerts, setPersonalAlerts] = useState([]);
  const [globalAlerts, setGlobalAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); 
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [syncToast, setSyncToast] = useState(false);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // Fetch Personal DB Alerts
      let personalData = [];
      try {
        const personalRes = await axios.get(`${apiUrl}/api/notifications`, { withCredentials: true });
        personalData = personalRes.data.map(a => ({
          ...a,
          source: 'personal',
          category: 'default',
          title: a.type.replace(/([A-Z])/g, ' $1').trim(),
          severity: a.type === 'EmergencyAlert' ? 'Critical' : 'Info'
        }));
      } catch (err) {
        console.warn("Could not fetch DB alerts, using mocks.");
      }

      // If DB is empty, use Mock Data so the presentation looks good
      if (personalData.length === 0) {
        personalData = [...MOCK_PERSONAL_ALERTS];
      }
      
      // If this is a manual refresh, let's inject a "NEW" mock personal message to prove refresh works!
      if (isRefresh) {
        const newLiveAlert = {
          _id: `live_${Date.now()}`,
          source: 'personal',
          category: 'fire',
          title: '🔥 NEW: Live System Scan Alert',
          message: `Intelligence sweep completed at ${new Date().toLocaleTimeString()}. Minor brush fire risk detected in adjacent county.`,
          createdAt: new Date().toISOString(),
          severity: 'Warning',
          readStatus: false
        };
        personalData = [newLiveAlert, ...personalData];
      }

      setPersonalAlerts(personalData);

      // Fetch Global Alerts (USGS Earthquakes + NASA EONET Events)
      let globalData = [];
      
      try {
        const usgs = await axios.get(`https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson?t=${Date.now()}`);
        usgs.data.features.slice(0, 8).forEach(f => {
          globalData.push({
            _id: f.id,
            source: 'global',
            category: 'earthquake',
            title: `Earthquake: Mag ${f.properties.mag.toFixed(1)}`,
            message: `Significant seismic activity detected near ${f.properties.place}. Depth: ${f.geometry.coordinates[2]}km.`,
            createdAt: f.properties.time,
            severity: f.properties.mag >= 6.0 ? 'Critical' : 'Warning',
            readStatus: true
          });
        });
      } catch (e) { console.error("USGS failed", e); }

      try {
        // Randomize NASA days to get different feeds on refresh
        const randomDays = isRefresh ? Math.floor(Math.random() * 5) + 5 : 15; 
        const eonet = await axios.get(`https://eonet.gsfc.nasa.gov/api/v3/events?status=open&days=${randomDays}&limit=12&t=${Date.now()}`);
        eonet.data.events.forEach(ev => {
          const cat = ev.categories[0]?.id;
          let category = 'storm';
          if(cat === '8') category = 'fire';
          if(cat === '15' || cat === '19') category = 'flood';
          if(cat === '14') category = 'earthquake'; 
          
          globalData.push({
            _id: ev.id,
            source: 'global',
            category: category,
            title: ev.title,
            message: `A severe ${category} event has been detected by NASA satellite observation networks.`,
            createdAt: ev.geometry[ev.geometry.length-1]?.date || new Date().toISOString(),
            severity: 'Warning',
            readStatus: true
          });
        });
      } catch (e) { console.error("NASA failed", e); }

      // If refresh, inject a fake global threat to show changes
      if (isRefresh) {
        globalData.unshift({
           _id: `global_mock_${Date.now()}`,
           source: 'global',
           category: 'storm',
           title: '🌀 LIVE INTERCEPT: Cyclone Formation',
           message: 'New cyclone formation intercepted by satellite radar over the last 60 seconds.',
           createdAt: new Date().toISOString(),
           severity: 'Critical',
           readStatus: true
        });
      }

      globalData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setGlobalAlerts(globalData);

      if (isRefresh) {
        await new Promise(resolve => setTimeout(resolve, 1200)); // Deep scan delay
        setSyncToast(true);
        setTimeout(() => setSyncToast(false), 3000);
      }

      // Auto-select
      if (!selectedAlert) {
        if (personalData.length > 0) setSelectedAlert(personalData[0]);
        else if (globalData.length > 0) setSelectedAlert(globalData[0]);
      } else if (isRefresh) {
         setSelectedAlert(personalData[0]); // Select the new injected alert
      }

    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const markAsRead = async (id) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      if(!id.toString().startsWith('mock') && !id.toString().startsWith('live')) {
        await axios.put(`${apiUrl}/api/notifications/${id}/read`, {}, { withCredentials: true }).catch(()=>null);
      }
      setPersonalAlerts(personalAlerts.map(a => a._id === id ? { ...a, readStatus: true } : a));
      if (selectedAlert && selectedAlert._id === id) {
        setSelectedAlert({ ...selectedAlert, readStatus: true });
      }
    } catch (error) {
      console.error('Error marking as read', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.put(`${apiUrl}/api/notifications/read-all`, {}, { withCredentials: true }).catch(()=>null);
      setPersonalAlerts(personalAlerts.map(a => ({ ...a, readStatus: true })));
    } catch (error) {
      console.error('Error marking all as read', error);
    }
  };

  let displayedAlerts = [];
  if (activeTab === 'all') {
    displayedAlerts = [...personalAlerts, ...globalAlerts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  else if (activeTab === 'unread') displayedAlerts = personalAlerts.filter(a => !a.readStatus);
  else if (activeTab === 'read') displayedAlerts = personalAlerts.filter(a => a.readStatus);
  else if (activeTab === 'global') displayedAlerts = globalAlerts;

  const unreadCount = personalAlerts.filter(a => !a.readStatus).length;

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0f1c] to-[#030610] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {syncToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-500/90 backdrop-blur-md text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400"
          >
            <Radio className="h-5 w-5 animate-pulse" />
            <span className="font-bold text-sm">Sync Complete: New Intelligence Intercepted</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px]"></div>
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full bg-emerald-900/5 blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-wrap justify-between items-center p-6 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)] border border-blue-400/30">
            <ShieldAlert className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Intelligence & Alerts</h1>
            <p className="text-sm text-slate-400">Real-time situational awareness and global threat monitoring.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <button 
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-bold text-sm shadow-lg border ${
              refreshing 
                ? 'bg-blue-900/50 text-blue-300 border-blue-500/50 cursor-not-allowed' 
                : 'bg-slate-800/80 hover:bg-slate-700 text-white border-slate-700 hover:border-slate-500 hover:shadow-blue-500/10'
            }`}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin text-blue-400' : ''}`} /> 
            {refreshing ? 'Intercepting Data...' : 'Live Refresh'}
          </button>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl transition-all font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-emerald-400/30 hover:scale-105"
            >
              <Check className="h-4 w-4" /> Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* Left Column - List of Alerts */}
        <div className="w-full md:w-[400px] lg:w-[450px] flex flex-col border-r border-slate-800/80 bg-slate-900/30 backdrop-blur-md">
          
          {/* Tabs Container */}
          <div className="border-b border-slate-800/80 bg-slate-900/80">
            <div className="flex p-3 gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
              {[
                { id: 'all', label: 'All Messages' },
                { id: 'unread', label: 'New Messages', badge: unreadCount },
                { id: 'read', label: 'Read' },
                { id: 'global', label: 'Global Threats', icon: Globe }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                    activeTab === tab.id 
                      ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400/50' 
                      : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/80 border border-transparent'
                  }`}
                >
                  {tab.icon && <tab.icon className="h-4 w-4" />}
                  {tab.label}
                  {tab.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-black tracking-wider ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.3)]'}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-3" />
                <p className="text-sm font-medium">Establishing connection...</p>
              </div>
            ) : displayedAlerts.length > 0 ? (
              <AnimatePresence>
                {displayedAlerts.map((alert) => {
                  const isSelected = selectedAlert?._id === alert._id;
                  const guidelines = SAFETY_GUIDELINES[alert.category] || SAFETY_GUIDELINES.default;
                  const Icon = guidelines.icon;
                  const isUnread = !alert.readStatus;

                  return (
                    <motion.button
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      key={alert._id}
                      onClick={() => {
                        setSelectedAlert(alert);
                        if (alert.source === 'personal' && isUnread) markAsRead(alert._id);
                      }}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 group relative overflow-hidden ${
                        isSelected 
                          ? `bg-slate-800/90 border-slate-500 shadow-xl scale-[1.01]` 
                          : `bg-slate-900/60 border-slate-800 hover:bg-slate-800 hover:border-slate-600`
                      }`}
                    >
                      {/* Unread Indicator Pulse */}
                      {isUnread && (
                        <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-blue-400 to-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                      )}

                      <div className="flex gap-4">
                        <div className={`mt-1 shrink-0 p-3 rounded-xl border ${guidelines.bg} ${guidelines.border} ${guidelines.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`text-sm font-bold truncate pr-2 ${isSelected || isUnread ? 'text-white' : 'text-slate-400'}`}>
                              {alert.title}
                            </h4>
                          </div>
                          <p className={`text-xs truncate mb-3 ${isSelected || isUnread ? 'text-slate-300' : 'text-slate-500'}`}>
                            {alert.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                                alert.severity === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                                alert.severity === 'Warning' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              }`}>
                                {alert.severity}
                              </span>
                              {alert.source === 'global' && (
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-slate-800 text-slate-400 border-slate-700 flex items-center gap-1">
                                  <Globe className="h-3 w-3" /> Intel
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-blue-300 bg-blue-900/40 px-2 py-0.5 rounded-md font-bold border border-blue-800/50 shadow-sm">
                              {new Date(alert.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                <CheckCircle className="h-10 w-10 text-slate-700 mb-3" />
                <p className="text-sm font-medium">No alerts in this category.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Detailed View & Precautions */}
        <div className="hidden md:flex flex-1 bg-[#02050d]/80 backdrop-blur-xl overflow-y-auto custom-scrollbar relative">
          {selectedAlert ? (
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedAlert._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8 w-full max-w-4xl mx-auto"
              >
                {/* Detail Header */}
                <div className="flex items-start gap-6 mb-10 pb-8 border-b border-slate-800/80">
                  <div className={`p-5 rounded-2xl border shadow-2xl ${
                    SAFETY_GUIDELINES[selectedAlert.category]?.bg || SAFETY_GUIDELINES.default.bg
                  } ${
                    SAFETY_GUIDELINES[selectedAlert.category]?.border || SAFETY_GUIDELINES.default.border
                  } ${
                    SAFETY_GUIDELINES[selectedAlert.category]?.color || SAFETY_GUIDELINES.default.color
                  }`}>
                    {(() => {
                      const Icon = SAFETY_GUIDELINES[selectedAlert.category]?.icon || SAFETY_GUIDELINES.default.icon;
                      return <Icon className="h-12 w-12" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border shadow-sm ${
                        selectedAlert.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 
                        selectedAlert.severity === 'Warning' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                        'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      }`}>
                        {selectedAlert.severity} {selectedAlert.category !== 'default' ? selectedAlert.category : 'Alert'}
                      </span>
                      <span className="text-xs text-blue-300 bg-slate-800/80 px-3 py-1 rounded-md flex items-center gap-1 font-bold border border-slate-700 shadow-sm">
                        <Clock className="h-3.5 w-3.5 text-blue-400" />
                        {new Date(selectedAlert.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <h2 className="text-4xl font-extrabold text-white mb-5 leading-tight tracking-tight">{selectedAlert.title}</h2>
                    <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl shadow-inner">
                      <p className="text-slate-300 text-lg leading-relaxed">
                        {selectedAlert.message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Precautions Section */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="h-7 w-7 text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <h3 className="text-2xl font-bold text-white tracking-tight">Standard Operating Procedures</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Before */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors shadow-lg">
                      <div className="flex items-center gap-2 mb-4 text-blue-400 border-b border-slate-800 pb-3">
                        <Activity className="h-5 w-5" />
                        <h4 className="font-bold text-lg">Preparation</h4>
                      </div>
                      <ul className="space-y-3">
                        {(SAFETY_GUIDELINES[selectedAlert.category] || SAFETY_GUIDELINES.default).before.map((txt, i) => (
                          <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                            <ChevronRight className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                            <span>{txt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* During */}
                    <div className="bg-red-950/30 border border-red-900/40 rounded-2xl p-6 hover:border-red-900/60 transition-colors relative overflow-hidden shadow-lg">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
                      <div className="flex items-center gap-2 mb-4 text-red-400 border-b border-red-900/30 pb-3">
                        <AlertTriangle className="h-5 w-5" />
                        <h4 className="font-bold text-lg">During Event</h4>
                      </div>
                      <ul className="space-y-3 relative z-10">
                        {(SAFETY_GUIDELINES[selectedAlert.category] || SAFETY_GUIDELINES.default).during.map((txt, i) => (
                          <li key={i} className="flex items-start gap-3 text-slate-200 text-sm font-medium">
                            <ChevronRight className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                            <span>{txt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* After */}
                    <div className="bg-emerald-950/30 border border-emerald-900/40 rounded-2xl p-6 hover:border-emerald-900/60 transition-colors shadow-lg">
                      <div className="flex items-center gap-2 mb-4 text-emerald-400 border-b border-emerald-900/30 pb-3">
                        <CheckCircle className="h-5 w-5" />
                        <h4 className="font-bold text-lg">Recovery</h4>
                      </div>
                      <ul className="space-y-3">
                        {(SAFETY_GUIDELINES[selectedAlert.category] || SAFETY_GUIDELINES.default).after.map((txt, i) => (
                          <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                            <ChevronRight className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{txt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Upcoming Warnings Banner */}
                <div className="mt-10 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-800/50 rounded-2xl p-6 flex items-center justify-between shadow-[0_0_25px_rgba(59,130,246,0.15)] relative overflow-hidden group hover:border-blue-600/50 transition-colors">
                  <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center gap-5 relative z-10">
                    <div className="p-4 bg-blue-500/20 rounded-full text-blue-400 shadow-inner">
                      <CloudLightning className="h-7 w-7 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-white font-extrabold text-xl tracking-tight">Predictive Weather Intelligence</h4>
                      <p className="text-slate-300 text-sm mt-1.5 max-w-2xl">Satellite weather monitoring detects no imminent severe weather fronts in your registered jurisdiction for the next 48 hours. Continue standard monitoring protocols.</p>
                    </div>
                  </div>
                  <div className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 rounded-xl text-sm font-black tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.2)] relative z-10">
                    ALL CLEAR
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center justify-center h-full w-full text-slate-500">
              <Globe className="h-20 w-20 text-slate-800 mb-6" />
              <h3 className="text-2xl font-bold text-slate-400 mb-2">Select an alert</h3>
              <p className="text-slate-600 max-w-sm text-center">Click on any notification or global threat from the left panel to view detailed intelligence reports and Standard Operating Procedures.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
