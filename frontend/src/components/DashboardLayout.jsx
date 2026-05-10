import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { ShieldAlert, LogOut, Menu, X, Home, Map, Bell, Settings, PhoneCall, HeartPulse, Users, PackageOpen, UserSearch, TrendingUp, Bot, User, Mail, ShieldCheck, Activity, Phone, MapPin, Droplet, QrCode, Share2, Info, Zap, CheckCircle2, Siren, AlertTriangle, Award, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const ProfileModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] pointer-events-none"></div>

        <div className="p-6 border-b border-slate-100 dark:border-dark-700 flex justify-between items-start relative z-10">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Account Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-dark-700 rounded-full text-slate-500 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-8 relative z-10 text-center flex flex-col items-center max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-lg mb-4 relative shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'Y'}
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white dark:border-dark-800"></div>
          </div>
          
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
             {user?.name?.toLowerCase().includes('yash') ? 'Yash' : user?.name}
          </h3>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <ShieldCheck className="h-4 w-4" />
            {user?.role || 'Citizen'}
          </div>

          <div className="w-full space-y-3 text-left">
            <div className="p-4 bg-slate-50 dark:bg-dark-900 rounded-2xl flex items-center gap-3 border border-slate-100 dark:border-dark-700">
              <Mail className="h-5 w-5 text-slate-400 shrink-0" />
              <div className="overflow-hidden">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{user?.email || 'user@example.com'}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-dark-900 rounded-2xl flex items-center gap-3 border border-slate-100 dark:border-dark-700">
              <Phone className="h-5 w-5 text-slate-400 shrink-0" />
              <div className="overflow-hidden">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mobile Number</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{user?.phone || '+1 (555) 019-8372'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-slate-50 dark:bg-dark-900 rounded-2xl border border-slate-100 dark:border-dark-700">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Safe Zone</p>
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">Sector 4 Shelter</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-dark-900 rounded-2xl border border-slate-100 dark:border-dark-700">
                <div className="flex items-center gap-2 mb-1">
                  <Droplet className="h-4 w-4 text-red-500" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Blood Type</p>
                </div>
                <p className="text-sm font-black text-slate-700 dark:text-slate-300">O-Positive</p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl flex items-center gap-3 border border-emerald-100 dark:border-emerald-800/30 mt-2">
              <Activity className="h-5 w-5 text-emerald-500 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">System Status</p>
                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Online & Verified for Dispatch</p>
              </div>
            </div>

            {/* Digital Identity QR */}
            <div className="mt-6 p-6 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="flex flex-col items-center gap-4 relative z-10">
                  <div className="p-4 bg-white rounded-2xl shadow-2xl">
                     <QrCode className="h-20 w-20 text-slate-900" />
                  </div>
                  <div className="text-center">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-1">Digital Identity Card</p>
                     <p className="text-xs font-bold opacity-60">Scan to Verify Credentials</p>
                  </div>
                  <div className="flex gap-2 w-full mt-2">
                     <button className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Download ID</button>
                     <button className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"><Share2 className="h-4 w-4" /></button>
                  </div>
               </div>
            </div>

            {/* Achievement Badges */}
            <div className="w-full mt-6 space-y-4">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Responder Achievements</h4>
               <div className="flex justify-center gap-3">
                  {[
                    { icon: <Award className="h-4 w-4 text-yellow-500" />, label: 'Verified', bg: 'bg-yellow-500/10' },
                    { icon: <HeartPulse className="h-4 w-4 text-red-500" />, label: 'Lifesaver', bg: 'bg-red-500/10' },
                    { icon: <ShieldCheck className="h-4 w-4 text-blue-500" />, label: 'Veteran', bg: 'bg-blue-500/10' },
                  ].map((badge, i) => (
                    <div key={i} className={`p-3 ${badge.bg} rounded-xl border border-white/10 group relative cursor-pointer`}>
                       {badge.icon}
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black uppercase px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {badge.label}
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

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCrisisMode, setIsCrisisMode] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  const navLinks = [
    { name: 'Overview', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
    { name: 'Live Map', path: '/dashboard/map', icon: <Map className="w-5 h-5" /> },
    { 
      name: 'Control Room', 
      path: '/dashboard/control', 
      icon: <Monitor className="w-5 h-5" />,
      restricted: true 
    },
    { name: 'Alerts', path: '/dashboard/alerts', icon: <Bell className="w-5 h-5" /> },
    { name: 'Emergency Contacts', path: '/dashboard/contacts', icon: <PhoneCall className="w-5 h-5" /> },
    { name: 'Survival Hub', path: '/dashboard/survival', icon: <HeartPulse className="w-5 h-5" /> },
    { name: 'Volunteer Network', path: '/dashboard/volunteers', icon: <Users className="w-5 h-5" /> },
    { name: 'Donations & Relief', path: '/dashboard/donations', icon: <PackageOpen className="w-5 h-5" /> },
    { name: 'Missing Persons', path: '/dashboard/missing', icon: <UserSearch className="w-5 h-5" /> },
    { name: 'Platform Impact', path: '/dashboard/impact', icon: <TrendingUp className="w-5 h-5" /> },
    { name: 'AI Copilot', path: '/dashboard/copilot', icon: <Bot className="w-5 h-5" /> },
    { name: 'Settings', path: '/dashboard/settings', icon: <Settings className="w-5 h-5" /> },
  ].filter(link => {
    if (link.restricted && userInfo?.role?.toLowerCase() === 'citizen') return false;
    return true;
  });

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-900 transition-colors">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-dark-800 border-r border-slate-200 dark:border-dark-700 transform transition-transform duration-300 flex flex-col lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-center shrink-0 h-20 border-b border-slate-200 dark:border-dark-700">
          <ShieldAlert className="h-8 w-8 text-emergency-red mr-2" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emergency-red to-orange-500 tracking-tight">DisasterResponseHub</span>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-2 px-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
            <nav className="space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <button
                    key={link.name}
                    onClick={() => { navigate(link.path); setSidebarOpen(false); }}
                    className={`flex w-full items-center px-3 py-3 text-sm font-medium rounded-xl transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-700'}`}
                  >
                    <span className="mr-3">{link.icon}</span>
                    {link.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-dark-700 shrink-0 bg-white dark:bg-dark-800">
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="w-full flex items-center mb-4 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-dark-700 transition-colors text-left border border-transparent hover:border-slate-200 dark:hover:border-dark-600"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold mr-3 shrink-0">
              {userInfo?.name?.charAt(0).toUpperCase() || 'Y'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black dark:text-white truncate">
                {userInfo?.name?.toLowerCase().includes('yash') ? 'Yash' : userInfo?.name}
              </p>
              <p className="text-xs text-slate-500 truncate">{userInfo?.role}</p>
            </div>
          </button>
          <button 
            onClick={handleLogout}
            className="flex w-full items-center px-3 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 sm:h-20 bg-white dark:bg-dark-800 border-b border-slate-200 dark:border-dark-700 flex items-center justify-between px-4 sm:px-6 lg:justify-end shrink-0">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white p-2"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-3 sm:space-x-6">
            <button 
              onClick={() => setIsCrisisMode(!isCrisisMode)}
              className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${
                isCrisisMode 
                ? 'bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)]' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-red-500/50 hover:text-red-500'
              }`}
            >
              <Siren className={`h-4 w-4 ${isCrisisMode ? 'animate-bounce' : ''}`} />
              {isCrisisMode ? 'Crisis Active' : 'Simulation'}
            </button>

            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-colors ${
              isCrisisMode 
              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
            }`}>
              <span className={`w-2 h-2 rounded-full mr-2 animate-pulse ${isCrisisMode ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
              {isCrisisMode ? 'Crisis' : 'Online'}
            </span>
          </div>
        </header>

        {/* Global Crisis Alert Banner */}
        <AnimatePresence>
          {isCrisisMode && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }}
              className="bg-red-600 text-white border-b border-red-500 overflow-hidden shrink-0"
            >
              <div className="px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 animate-bounce" />
                  <p className="text-xs font-black uppercase tracking-widest">Global Protocol Zero Initialized: Tactical response priorities enabled</p>
                </div>
                <button onClick={() => setIsCrisisMode(false)} className="text-[10px] font-black underline uppercase opacity-70 hover:opacity-100">Dismiss Alert</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Situation Ticker */}
        <div className={`text-white h-8 sm:h-10 flex items-center overflow-hidden border-b border-white/5 relative z-10 shrink-0 transition-colors duration-500 ${isCrisisMode ? 'bg-red-950' : 'bg-slate-900'}`}>
           <div className="bg-primary px-3 sm:px-4 h-full flex items-center gap-2 z-20 shadow-[10px_0_20px_rgba(0,0,0,0.5)]">
              <Zap className="h-3 w-3 sm:h-4 sm:h-4 text-white animate-pulse" />
              <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest">Live Updates</span>
           </div>
           <div className="flex-1 whitespace-nowrap relative overflow-hidden">
              <motion.div 
                animate={{ x: [0, -1500] }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="flex items-center gap-12 sm:gap-16 px-8 text-[9px] sm:text-[11px] font-bold tracking-wide"
              >
                 <span className="flex items-center gap-2">⚠️ <span className="text-orange-400">ALERT:</span> Severe Monsoon warning issued for Coastal Kerala... [ETA: 4h]</span>
                 <span className="flex items-center gap-2">✅ <span className="text-emerald-400">RESOLVED:</span> Flash flood rescue mission in Sector 4 successfully closed.</span>
                 <span className="flex items-center gap-2">🌍 <span className="text-blue-400">NETWORK:</span> 1.2k New Responders joined the DisasterResponseHub network.</span>
                 <span className="flex items-center gap-2">📦 <span className="text-purple-400">SUPPLY:</span> 400 Medical Kits dispatched to Central High Shelter.</span>
                 <span className="flex items-center gap-2">📡 <span className="text-slate-400">SYSTEM:</span> AI Analysis complete for Northeast Seismic Zone – No critical threats.</span>
                 {/* Duplicated for seamless loop */}
                 <span className="flex items-center gap-2">⚠️ <span className="text-orange-400">ALERT:</span> Severe Monsoon warning issued for Coastal Kerala... [ETA: 4h]</span>
              </motion.div>
           </div>
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-dark-900 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      
      <AnimatePresence>
        {isProfileOpen && (
          <ProfileModal 
            isOpen={isProfileOpen} 
            onClose={() => setIsProfileOpen(false)} 
            user={userInfo} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
