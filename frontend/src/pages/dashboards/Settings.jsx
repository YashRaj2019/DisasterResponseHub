import { useState } from 'react';
import { User, Shield, Bell, Phone, Mail, Camera, Save, Loader2, CheckCircle2, MapPin, Lock, Smartphone } from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    phone: userInfo?.phone || '',
  });

  // Notification Toggles
  const [toggles, setToggles] = useState({
    emergency: true,
    volunteer: true,
    system: false,
    sms: true
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  const toggleNotification = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 max-w-5xl">
      
      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500/95 backdrop-blur-md text-white px-6 py-4 rounded-2xl flex items-center gap-4 shadow-[0_10px_40px_rgba(16,185,129,0.4)] border border-emerald-400"
          >
            <CheckCircle2 className="h-6 w-6 text-white" />
            <span className="font-bold text-lg">Settings saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Account Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-lg">Manage your personal profile and system preferences.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card */}
        <div className="xl:col-span-1 space-y-8">
          <div className="bg-white dark:bg-[#0a0f1c] rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden text-center group">
            <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-blue-500/10 to-transparent"></div>
            
            <div className="relative inline-block mb-6 mt-4">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-5xl font-black border-4 border-white dark:border-slate-800 shadow-2xl relative z-10 transform group-hover:scale-105 transition-transform duration-300">
                {userInfo?.name?.charAt(0) || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 p-3 bg-white dark:bg-slate-700 rounded-full shadow-xl border border-slate-100 dark:border-slate-600 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 text-slate-600 dark:text-slate-300 transition-all z-20 hover:scale-110">
                <Camera className="h-5 w-5" />
              </button>
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{userInfo?.name || 'User'}</h2>
            <p className="text-blue-500 font-bold uppercase tracking-widest text-xs mt-2">{userInfo?.role || 'Citizen'}</p>
            
            <div className="mt-6 flex items-center justify-center gap-2">
              <span className="px-4 py-1.5 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black tracking-widest uppercase rounded-full flex items-center gap-2">
                <Shield className="h-3.5 w-3.5" /> Verified
              </span>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-left space-y-4">
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                <MapPin className="h-5 w-5" />
                <span className="font-medium">New Delhi, India</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                <Lock className="h-5 w-5" />
                <span className="font-medium">Joined May 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="xl:col-span-2 space-y-8">
          
          <form onSubmit={handleSave} className="bg-white dark:bg-[#0a0f1c] rounded-[2rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
              <User className="text-blue-500 h-6 w-6" /> Personal Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-2 relative group">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                  <User className="h-3.5 w-3.5" /> Full Name
                </label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white font-medium transition-all group-hover:border-blue-500/30" 
                />
              </div>

              <div className="space-y-2 relative group">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                  <Mail className="h-3.5 w-3.5" /> Email Address
                </label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white font-medium transition-all group-hover:border-blue-500/30" 
                />
              </div>

              <div className="space-y-2 relative group">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                  <Phone className="h-3.5 w-3.5" /> Phone Number
                </label>
                <input 
                  type="tel" 
                  value={formData.phone} 
                  placeholder="Not provided"
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white font-medium transition-all group-hover:border-blue-500/30" 
                />
              </div>

              <div className="space-y-2 relative opacity-70">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                  <Shield className="h-3.5 w-3.5" /> Role Level
                </label>
                <input 
                  type="text" 
                  disabled 
                  value={userInfo?.role || 'Citizen'} 
                  className="w-full px-5 py-4 bg-slate-100 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 cursor-not-allowed font-medium" 
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-8 border-t border-slate-200 dark:border-slate-800">
              <button 
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>

          {/* Notifications Preferences */}
          <div className="bg-white dark:bg-[#0a0f1c] rounded-[2rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
              <Bell className="text-emerald-500 h-6 w-6" /> Alert Preferences
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Control how and when DisasterLink contacts you during emergencies.</p>
            
            <div className="space-y-6">
              {[
                { id: 'emergency', icon: Shield, title: 'Critical Emergency Alerts', desc: 'Receive immediate push notifications for major threats.', color: 'red' },
                { id: 'volunteer', icon: User, title: 'Volunteer Dispatches', desc: 'Get pinged when local response teams need your registered skills.', color: 'blue' },
                { id: 'sms', icon: Smartphone, title: 'SMS Fallback', desc: 'Send alerts via standard text message if internet connection drops.', color: 'emerald' },
                { id: 'system', icon: Lock, title: 'System Updates', desc: 'Non-critical news about platform maintenance and features.', color: 'slate' }
              ].map((opt) => {
                const Icon = opt.icon;
                const isActive = toggles[opt.id];
                return (
                  <div key={opt.id} className={`flex items-center justify-between p-6 rounded-2xl border transition-all ${isActive ? `border-${opt.color}-500/30 bg-${opt.color}-500/5` : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30'}`}>
                    <div className="flex items-center gap-5">
                      <div className={`p-3 rounded-xl shadow-inner ${isActive ? `bg-${opt.color}-500/20 text-${opt.color}-500` : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className={`text-lg font-bold tracking-tight ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{opt.title}</h4>
                        <p className="text-sm font-medium text-slate-500">{opt.desc}</p>
                      </div>
                    </div>
                    
                    {/* Custom Toggle Switch */}
                    <button 
                      onClick={() => toggleNotification(opt.id)}
                      className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isActive ? `bg-${opt.color}-500 shadow-[0_0_15px_rgba(var(--tw-colors-${opt.color}-500),0.5)]` : 'bg-slate-300 dark:bg-slate-700'}`}
                    >
                      <span className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Settings;
