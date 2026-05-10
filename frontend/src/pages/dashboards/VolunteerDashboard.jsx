import { useState, useEffect } from 'react';
import { MapPin, CheckCircle, Navigation, Clock, Loader2, AlertCircle, Shield, Zap, TrendingUp, Activity, MessageSquare, Compass, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import useSocket from '../../hooks/useSocket';

const VolunteerDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [nearbyEmergencies, setNearbyEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const socket = useSocket();

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchData = async () => {
    try {
      if (refreshing) return;
      setLoading(true);
      setRefreshing(true);
      const [tasksRes, emergenciesRes] = await Promise.all([
        axios.get(`${apiUrl}/api/tasks/my-tasks`, { withCredentials: true }),
        axios.get(`${apiUrl}/api/emergencies`, { withCredentials: true })
      ]);
      setTasks(tasksRes.data);
      setNearbyEmergencies(emergenciesRes.data.filter(e => e.status === 'Reported').slice(0, 5));
    } catch (error) {
      console.error('Error fetching volunteer data:', error);
    } finally {
      setLoading(false);
      setTimeout(() => setRefreshing(false), 1000);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('newTaskAssigned', () => fetchData());
      socket.on('newEmergency', () => fetchData());
    }
    return () => {
      if (socket) {
        socket.off('newTaskAssigned');
        socket.off('newEmergency');
      }
    };
  }, [socket]);

  const updateStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`${apiUrl}/api/tasks/${taskId}/status`, { status: newStatus }, { withCredentials: true });
      fetchData();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const activeTask = tasks.find(t => t.status !== 'Completed');

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* ── COMMAND HUB HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white shadow-2xl shadow-blue-500/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.2),transparent)]"></div>
        <div className="absolute top-0 right-0 p-8 flex gap-4">
           <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Response Network</span>
              <span className="text-xl font-black">ACTIVE GRID</span>
           </div>
           <div className="w-px h-10 bg-white/10 hidden md:block"></div>
           <button 
             onClick={() => setIsOnDuty(!isOnDuty)}
             className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all font-black uppercase tracking-widest text-[10px] border-2 ${isOnDuty ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/20' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
           >
             <div className={`w-2 h-2 rounded-full ${isOnDuty ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
             {isOnDuty ? 'On Duty' : 'Off Duty'}
           </button>
        </div>

        <div className="p-8 md:p-12 relative z-10">
          <div className="flex items-center gap-4 mb-6">
             <div className="p-3 bg-blue-500 rounded-2xl shadow-lg shadow-blue-500/30">
                <Shield className="h-6 w-6 text-white" />
             </div>
             <h1 className="text-3xl md:text-5xl font-black tracking-tighter">Responder Command Hub</h1>
          </div>
          <p className="text-slate-400 max-w-xl text-lg font-medium mb-10 leading-relaxed">
             Monitor live incidents, manage assignments, and coordinate with the DisasterResponseHub network in real-time.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { label: 'Active Missions', value: '12', icon: <Zap className="text-blue-400" /> },
               { label: 'Network Pulse', value: 'Live', icon: <Activity className="text-emerald-400" /> },
               { label: 'Response Time', value: '4m 12s', icon: <Clock className="text-orange-400" /> },
               { label: 'Impact Score', value: '98%', icon: <TrendingUp className="text-purple-400" /> },
             ].map(stat => (
               <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-1">
                     {stat.icon}
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</span>
                  </div>
                  <div className="text-xl font-black">{stat.value}</div>
               </div>
             ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── LEFT COLUMN: MISSIONS ────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Assignment */}
          <section className="bg-white dark:bg-dark-800 rounded-[2rem] p-8 border border-slate-100 dark:border-dark-700 shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Compass className="w-32 h-32" />
             </div>
             
             <div className="flex items-center justify-between mb-8">
                <div>
                   <h2 className="text-2xl font-black dark:text-white tracking-tight">Current Assignment</h2>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Operational Dispatch</p>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-dark-900 rounded-xl"><Navigation className="h-5 w-5 text-primary" /></div>
             </div>

             <AnimatePresence mode="wait">
               {loading ? (
                 <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>
               ) : activeTask ? (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-50 dark:bg-dark-900 border-2 border-primary/20 rounded-[2rem] p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
                    
                    <div className="flex justify-between items-start mb-6">
                       <div>
                          <div className="flex items-center gap-3 mb-2">
                             <span className="px-3 py-1 bg-primary text-white text-[10px] font-black rounded-full uppercase tracking-widest">{activeTask.status}</span>
                             <span className="text-xs font-bold text-slate-400">Incident #{activeTask.emergency._id.slice(-6)}</span>
                          </div>
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{activeTask.emergency.title}</h3>
                       </div>
                       <button className="p-4 bg-white dark:bg-dark-800 rounded-2xl shadow-xl hover:scale-110 transition-all text-primary border border-slate-100 dark:border-dark-700">
                          <MessageSquare className="h-5 w-5" />
                       </button>
                    </div>

                    <div className="flex items-center gap-3 mb-8 p-4 bg-white dark:bg-dark-800 rounded-2xl border border-slate-100 dark:border-dark-700">
                       <MapPin className="h-5 w-5 text-emergency-red shrink-0" />
                       <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{activeTask.emergency.location.address}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                       <button onClick={() => updateStatus(activeTask._id, 'Completed')} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3 active:scale-95">
                          <CheckCircle className="h-5 w-5" /> Mark as Resolved
                       </button>
                       <button className="flex-1 bg-slate-900 dark:bg-dark-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl hover:bg-slate-800 flex items-center justify-center gap-3 active:scale-95">
                          <Navigation className="h-5 w-5 text-primary" /> Recalculate Route
                       </button>
                    </div>
                 </motion.div>
               ) : (
                 <div className="text-center py-16 bg-slate-50 dark:bg-dark-900 rounded-[2rem] border border-dashed border-slate-300 dark:border-dark-600 relative overflow-hidden">
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0 bg-primary/5 pointer-events-none"
                    ></motion.div>
                    
                    <div className="relative z-10">
                      <div className="w-20 h-20 bg-white dark:bg-dark-800 rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform">
                         <Shield className="h-10 w-10 text-primary animate-pulse" />
                      </div>
                      <p className="text-slate-500 text-xl font-black tracking-tight">Ready for Dispatch</p>
                      <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto mb-8 font-medium">Stay on alert. You will be notified immediately when an incident requires your expertise.</p>
                      <button 
                        onClick={() => fetchData()}
                        className="px-8 py-3 bg-white dark:bg-dark-700 text-primary border border-primary/20 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-lg active:scale-95"
                      >
                         Deep Scan Network
                      </button>
                    </div>
                 </div>
               )}
             </AnimatePresence>
          </section>

          {/* Nearby Incident Grid */}
          <section className="space-y-6">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-2xl font-black dark:text-white tracking-tight flex items-center gap-3">
                   <AlertCircle className="text-orange-500" /> Nearby Incidents
                </h3>
                <button 
                  onClick={() => fetchData()}
                  disabled={refreshing}
                  className="text-xs font-black text-primary uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-primary/20 transition-all active:scale-95 disabled:opacity-50"
                >
                   <motion.div animate={{ rotate: refreshing ? 360 : 0 }} transition={{ duration: 1, repeat: refreshing ? Infinity : 0 }}>
                      <Activity className="h-3 w-3" />
                   </motion.div>
                   {refreshing ? 'Scanning...' : '5 New Reports'}
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {nearbyEmergencies.map(e => (
                  <motion.div 
                    key={e._id} 
                    layout
                    onClick={() => setExpandedId(expandedId === e._id ? null : e._id)}
                    className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${expandedId === e._id ? 'border-primary bg-primary/5 shadow-2xl' : 'bg-white dark:bg-dark-800 border-slate-100 dark:border-dark-700 hover:border-primary'}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                       <div className="p-3 bg-slate-50 dark:bg-dark-900 rounded-2xl">
                          <AlertCircle className={`h-6 w-6 ${e.severity === 'Critical' ? 'text-emergency-red' : 'text-orange-500'}`} />
                       </div>
                       <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em] ${e.severity === 'Critical' ? 'bg-emergency-red text-white' : 'bg-orange-500 text-white'}`}>
                          {e.severity}
                       </span>
                    </div>

                    <div className="mb-4">
                       <h4 className="text-xl font-black text-slate-800 dark:text-white mb-2 leading-tight">{e.title}</h4>
                       <p className="text-sm text-slate-500 line-clamp-2 font-medium">{e.description}</p>
                    </div>

                    <AnimatePresence>
                       {expandedId === e._id && (
                         <motion.div 
                           initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                           className="overflow-hidden border-t border-slate-200 dark:border-dark-700 mt-4 pt-6 space-y-4"
                         >
                            <div className="space-y-4">
                               <div className="flex items-center gap-3 p-4 bg-white dark:bg-dark-800 rounded-2xl border border-slate-100 dark:border-dark-700">
                                  <MapPin className="h-4 w-4 text-primary" />
                                  <span className="text-xs font-bold dark:text-slate-300">{e.location?.address}</span>
                               </div>
                               <button className="w-full bg-slate-900 dark:bg-primary text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all">
                                  Accept Dispatch Mission
                               </button>
                            </div>
                         </motion.div>
                       )}
                    </AnimatePresence>

                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-50 dark:border-dark-700/50">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(e.createdAt).toLocaleTimeString()}</span>
                       <button className="text-xs font-black text-primary uppercase tracking-[0.2em] hover:underline transition-all">
                          {expandedId === e._id ? 'Close' : 'Inspect'}
                       </button>
                    </div>
                  </motion.div>
                ))}
             </div>
          </section>
        </div>

        {/* ── RIGHT COLUMN: IMPACT & NETWORK ──────────────────────────────────── */}
        <div className="space-y-8">
           <section className="bg-white dark:bg-dark-800 rounded-[2rem] p-8 border border-slate-100 dark:border-dark-700 shadow-xl overflow-hidden relative">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
              <h3 className="text-xl font-black dark:text-white mb-8 flex items-center gap-3">
                 <TrendingUp className="text-emerald-500" /> Personalized Impact
              </h3>
              
              <div className="space-y-6">
                 {[
                   { label: 'Total Resolutions', value: tasks.filter(t => t.status === 'Completed').length, icon: <CheckCircle />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                   { label: 'Operational Hours', value: '48.5', icon: <Clock />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                   { label: 'Citizens Assisted', value: '124', icon: <Users />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                 ].map(stat => (
                    <div key={stat.label} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-dark-900 rounded-2xl border border-slate-100 dark:border-dark-700 hover:scale-[1.02] transition-transform cursor-default">
                       <div className="flex items-center gap-4">
                          <div className={`p-3 ${stat.bg} ${stat.color} rounded-xl shadow-inner`}>{stat.icon}</div>
                          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                       </div>
                       <span className="text-2xl font-black dark:text-white">{stat.value}</span>
                    </div>
                 ))}
              </div>

              <div className="mt-10 p-6 bg-gradient-to-br from-primary to-blue-700 rounded-3xl text-white shadow-xl shadow-primary/30 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-20"><Activity className="w-12 h-12" /></div>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-80">Rank: Senior Responder</p>
                 <div className="text-2xl font-black mb-4 tracking-tighter italic">Top 5% Globally</div>
                 <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-white"></motion.div>
                 </div>
              </div>
           </section>

           <section className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.15),transparent)]"></div>
              <h3 className="text-xl font-black mb-6 flex items-center gap-3 relative z-10">
                 <Shield className="text-blue-400" /> Network Status
              </h3>
              <div className="space-y-4 relative z-10">
                 <div className="flex items-center justify-between p-3 border border-white/10 rounded-xl">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Responders</span>
                    <span className="font-black">12.4k</span>
                 </div>
                 <div className="flex items-center justify-between p-3 border border-white/10 rounded-xl">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Secure Channels</span>
                    <span className="font-black text-emerald-400">Encrypted</span>
                 </div>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
