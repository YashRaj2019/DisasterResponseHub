import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, Users, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 text-slate-900 dark:text-slate-100 transition-colors">
      <nav className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="h-6 w-6 sm:h-8 sm:h-8 text-emergency-red" />
          <span className="text-xl sm:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emergency-red to-orange-500 tracking-tighter">
            DisasterResponseHub
          </span>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Link to="/login" className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium hover:text-primary transition-colors">Login</Link>
          <Link to="/register" className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-emergency-red/10 text-emergency-red text-sm font-medium mb-8">
          <span className="flex w-2 h-2 rounded-full bg-emergency-red mr-2 animate-pulse"></span>
          Live Emergency Response System
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-8 relative z-10">
          Connect. Coordinate. <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Save Lives.</span>
        </h1>
        
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 relative z-10 font-medium">
          A real-time disaster management platform connecting citizens in distress with rapid response volunteers and centralized authorities.
        </p>

        {/* Hero Image Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="relative max-w-5xl mx-auto mb-24 rounded-[3rem] overflow-hidden shadow-2xl border border-white/20"
        >
          <img src="/disaster_command_center_hero_1778415463672.png" alt="Command Center" className="w-full h-auto" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-xs font-black uppercase tracking-[0.4em]">
             DisasterResponseHub Integrated Command Center
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/register" className="px-8 py-4 text-lg font-bold bg-emergency-red text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-emergency-red/30 flex items-center justify-center">
            <Activity className="mr-2 h-5 w-5" />
            Report Emergency
          </Link>
          <Link to="/register" className="px-8 py-4 text-lg font-bold bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-xl hover:border-primary transition-colors flex items-center justify-center">
            <Users className="mr-2 h-5 w-5" />
            Join as Volunteer
          </Link>
        </div>
        
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Real-Time Tracking', desc: 'Live map updates of emergencies and volunteer movements.', icon: <MapPin className="h-8 w-8 text-primary mb-4" /> },
            { title: 'Instant Verification', desc: 'Crowdsourced multi-point verification to reduce false alarms.', icon: <ShieldAlert className="h-8 w-8 text-emergency-orange mb-4" /> },
            { title: 'Smart Dispatch', desc: 'AI-assisted routing to assign the nearest available responders.', icon: <Activity className="h-8 w-8 text-emergency-green mb-4" /> },
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white dark:bg-dark-800 border border-slate-100 dark:border-dark-700 hover:shadow-xl transition-shadow text-left">
              {feature.icon}
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-slate-500 dark:text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
