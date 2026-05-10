import React, { useState, useEffect } from 'react';
import { Heart, Package, Search, MapPin, CheckCircle2, DollarSign, X, Droplets, Utensils, ShieldCheck, CreditCard, Lock, Loader2, QrCode, Smartphone, ArrowRight, Zap, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SUPPLIES_NEEDED = [
  { id: 1, name: 'O-Negative Blood', category: 'Medical', urgency: 'Critical', needed: 50, pledged: 12, icon: Droplets, color: 'red' },
  { id: 2, name: 'Winter Blankets', category: 'Shelter', urgency: 'High', needed: 500, pledged: 340, icon: Package, color: 'blue' },
  { id: 3, name: 'Purified Water (Gallons)', category: 'Rations', urgency: 'Medium', needed: 1000, pledged: 850, icon: Utensils, color: 'cyan' },
  { id: 4, name: 'First Aid Kits', category: 'Medical', urgency: 'High', needed: 200, pledged: 45, icon: Heart, color: 'emerald' },
];

const getColorClasses = (color) => {
  const classes = {
    red: { bg: 'bg-red-600', hoverBg: 'hover:bg-red-500', text: 'text-red-600', darkText: 'dark:text-red-400', iconBg: 'bg-red-500/10' },
    blue: { bg: 'bg-blue-600', hoverBg: 'hover:bg-blue-500', text: 'text-blue-600', darkText: 'dark:text-blue-400', iconBg: 'bg-blue-500/10' },
    cyan: { bg: 'bg-cyan-600', hoverBg: 'hover:bg-cyan-500', text: 'text-cyan-600', darkText: 'dark:text-cyan-400', iconBg: 'bg-cyan-500/10' },
    emerald: { bg: 'bg-emerald-600', hoverBg: 'hover:bg-emerald-500', text: 'text-emerald-600', darkText: 'dark:text-emerald-400', iconBg: 'bg-emerald-500/10' }
  };
  return classes[color] || classes.blue;
};

const PaymentModal = ({ isOpen, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD'); // 'USD' or 'INR'
  const [method, setMethod] = useState('card'); // 'card', 'upi', 'qr'
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [step, setStep] = useState(1); 

  const symbol = currency === 'USD' ? '$' : '₹';

  if (!isOpen) return null;

  const handlePayment = (e) => {
    e.preventDefault();
    setProcessing(true);
    
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
        // Convert to USD for parent state if needed, or just pass as is
        onSuccess(Number(amount), currency);
        setAmount('');
        setUpiId('');
        setStep(1);
        onClose();
      }, 2000);
    }, 2500);
  };

  const methods = [
    { id: 'card', name: 'Card', icon: CreditCard },
    { id: 'upi', name: 'UPI', icon: Smartphone },
    { id: 'qr', name: 'QR Code', icon: QrCode },
  ];

  const presets = currency === 'USD' ? [50, 100, 500] : [500, 2000, 5000];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-[#0a0f1c] border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden relative"
      >
        {!success ? (
          <>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Relief Payment</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure Gateway v2.5</p>
                </div>
              </div>
              <button onClick={onClose} disabled={processing} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors disabled:opacity-50">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePayment} className="p-8 space-y-6">
              {step === 1 ? (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  
                  {/* Currency Toggle */}
                  <div className="flex justify-center">
                    <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl flex gap-1 border border-slate-200 dark:border-slate-800">
                      {['USD', 'INR'].map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => { setCurrency(c); setAmount(''); }}
                          className={`px-6 py-2 rounded-xl font-black text-sm transition-all ${currency === c ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          {c === 'USD' ? '$ USD' : '₹ INR'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Select Amount</label>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {presets.map(val => (
                        <button 
                          key={val}
                          type="button"
                          onClick={() => setAmount(val.toString())}
                          className={`py-3 rounded-xl font-black transition-all ${amount === val.toString() ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-transparent hover:border-emerald-500'}`}
                        >
                          {symbol}{val}
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300 pointer-events-none">{symbol}</span>
                      <input 
                        type="number" 
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white font-black text-xl shadow-inner" 
                        placeholder="Custom Amount"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Payment Method</label>
                    <div className="grid grid-cols-3 gap-3">
                      {methods.map(m => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setMethod(m.id)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${method === m.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400' : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200'}`}
                        >
                          <m.icon className="h-6 w-6" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{m.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    type="button"
                    disabled={!amount}
                    onClick={() => setStep(2)}
                    className="w-full py-4 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:translate-x-1 transition-all shadow-xl disabled:opacity-50"
                  >
                    Continue to Payment <ArrowRight className="h-5 w-5" />
                  </button>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  
                  {method === 'card' && (
                    <div className="space-y-4">
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input 
                          type="text" required
                          className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none text-slate-900 dark:text-white font-medium" 
                          placeholder="Card Number"
                        />
                      </div>
                      <div className="flex gap-4">
                        <input type="text" required className="w-1/2 px-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none text-slate-900 dark:text-white font-medium" placeholder="MM/YY" />
                        <input type="text" required className="w-1/2 px-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none text-slate-900 dark:text-white font-medium" placeholder="CVC" />
                      </div>
                    </div>
                  )}

                  {method === 'upi' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20 flex items-center gap-3">
                        <Zap className="h-5 w-5 text-blue-500" />
                        <p className="text-xs font-bold text-blue-700 dark:text-blue-400">BHIM UPI Lightning Secure enabled.</p>
                      </div>
                      <div className="relative">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input 
                          type="text" required
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none text-slate-900 dark:text-white font-black" 
                          placeholder="yashraj@okicici"
                        />
                      </div>
                    </div>
                  )}

                  {method === 'qr' && (
                    <div className="flex flex-col items-center py-6 bg-white dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-slate-800">
                      <div className="p-4 bg-white rounded-2xl shadow-lg mb-4 border border-slate-100">
                        <QrCode className="h-36 w-36 text-slate-900" />
                      </div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">Scan QR to Pay {symbol}{amount}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => setStep(1)}
                      disabled={processing}
                      className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black hover:bg-slate-200 transition-all disabled:opacity-50"
                    >
                      Back
                    </button>
                    <button 
                      type="submit" 
                      disabled={processing}
                      className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 hover:bg-emerald-500 transition-all disabled:opacity-70"
                    >
                      {processing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-5 w-5" />}
                      {processing ? 'Processing...' : `Pay ${symbol}${amount}`}
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-16 text-center flex flex-col items-center"
          >
            <div className="w-28 h-28 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-8 relative">
               <motion.div 
                 initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}
                 className="absolute inset-0 bg-emerald-500 rounded-full scale-110 opacity-20 animate-ping"
               ></motion.div>
               <CheckCircle2 className="h-14 w-14 text-emerald-500 relative z-10" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Payment Received!</h3>
            <p className="text-slate-500 font-bold max-w-[250px] leading-relaxed tracking-tight">Transaction confirmed. Thank you for your support of {symbol}{amount}.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

const PledgeModal = ({ isOpen, onClose, item, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !item) return null;
  const theme = getColorClasses(item.color);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess(item, amount);
        setAmount('');
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-[#0a0f1c] border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden relative"
      >
        {!success ? (
          <>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Pledge Supply</h2>
              <button onClick={onClose} disabled={submitting} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors disabled:opacity-50">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className={`p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800`}>
                <h3 className={`text-lg font-black ${theme.text} ${theme.darkText} mb-1 flex items-center gap-2`}>
                  <item.icon className="h-5 w-5" /> {item.name}
                </h3>
                <p className="text-sm text-slate-500 font-medium">Goal: {item.needed} units</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Pledge Amount (Units)</label>
                <input 
                  type="number" required min="1" max={item.needed - item.pledged}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={submitting}
                  className="w-full px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white font-black text-2xl shadow-inner disabled:opacity-50" 
                  placeholder={`Max: ${item.needed - item.pledged}`}
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting || !amount}
                className={`w-full py-4 ${theme.bg} ${theme.hoverBg} text-white rounded-2xl font-black transition-all shadow-xl disabled:opacity-70 flex items-center justify-center gap-2`}
              >
                {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Package className="h-5 w-5" />}
                {submitting ? 'Processing...' : 'Confirm Pledge'}
              </button>
            </form>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-16 text-center flex flex-col items-center"
          >
            <div className={`w-28 h-28 ${theme.iconBg} rounded-full flex items-center justify-center mb-8`}>
              <CheckCircle2 className={`h-14 w-14 ${theme.text} ${theme.darkText}`} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Pledge Confirmed!</h3>
            <p className="text-slate-500 font-bold tracking-tight">Your contribution is being routed to central inventory.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

const DonationsHub = () => {
  const [supplies, setSupplies] = useState(SUPPLIES_NEEDED);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const [fundRaised, setFundRaised] = useState(185420);
  const fundGoal = 250000;
  const fundProgress = Math.round((fundRaised / fundGoal) * 100);

  const handlePledgeSuccess = (item, amount) => {
    const updated = supplies.map(s => {
      if (s.id === item.id) {
        return { ...s, pledged: s.pledged + parseInt(amount) };
      }
      return s;
    });
    setSupplies(updated);
    setToastMessage(`Successfully pledged ${amount} units of ${item.name}!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handlePaymentSuccess = (amount, currency) => {
    // Simple conversion if INR (assuming 1 USD = 80 INR for demo)
    const amountInUSD = currency === 'INR' ? amount / 80 : amount;
    setFundRaised(prev => prev + amountInUSD);
    
    const symbol = currency === 'USD' ? '$' : '₹';
    setToastMessage(`Successfully processed donation of ${symbol}${amount}!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 relative">
      
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[110] bg-slate-900/90 dark:bg-emerald-500/95 backdrop-blur-md text-white px-8 py-4 rounded-3xl flex items-center gap-4 shadow-2xl border border-white/10"
          >
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            <span className="font-bold text-lg">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Relief Hub</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-lg">Support affected communities through funds and critical supplies.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Financial Relief Fund */}
        <div className="xl:col-span-3">
          <div className="bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-700 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
              <div className="flex-1 w-full text-white">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-xs font-black tracking-widest uppercase mb-6 backdrop-blur-md">
                  <DollarSign className="h-4 w-4" /> Official Relief Fund
                </div>
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">${fundRaised.toLocaleString()} Raised</h2>
                <p className="text-emerald-50/80 font-medium text-xl max-w-2xl">Help us reach our ${fundGoal.toLocaleString()} goal to deploy advanced medical tents and field clinics in affected sectors.</p>
                
                <div className="mt-10">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-sm font-black uppercase tracking-widest text-emerald-100 opacity-80">Campaign Progress</span>
                    <span className="text-3xl font-black">{fundProgress}%</span>
                  </div>
                  <div className="h-5 w-full bg-black/20 rounded-full overflow-hidden shadow-inner p-1">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${fundProgress}%` }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className="h-full rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.6)]"
                    ></motion.div>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-auto shrink-0 flex flex-col gap-6">
                <button 
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="w-full md:w-72 py-5 bg-white text-emerald-700 hover:bg-emerald-50 rounded-[2rem] font-black text-xl transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                >
                  <Zap className="h-6 w-6" /> Donate Funds
                </button>
                <div className="flex flex-col items-center gap-2">
                   <div className="flex items-center gap-2 px-4 py-2 bg-black/10 rounded-full">
                     <Lock className="h-3 w-3 text-emerald-200" />
                     <p className="text-emerald-100 text-[10px] font-black uppercase tracking-[0.2em]">Secure Processing</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Supply Chain Requests */}
        <div className="xl:col-span-3">
          <div className="bg-white dark:bg-[#0a0f1c] rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-xl shadow-lg shadow-blue-500/20">
                <Package className="text-white h-6 w-6" />
              </div>
              Urgent Supply Requests
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {supplies.map(item => {
                const Icon = item.icon;
                const theme = getColorClasses(item.color);
                const progress = Math.min(100, Math.round((item.pledged / item.needed) * 100));
                
                return (
                  <div key={item.id} className={`p-8 rounded-[2rem] border transition-all duration-500 group relative overflow-hidden ${progress >= 100 ? 'border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/5' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-blue-400'}`}>
                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div className="flex items-center gap-5">
                        <div className={`p-4 rounded-[1.25rem] shadow-inner transition-transform group-hover:rotate-6 ${theme.iconBg} ${theme.text} ${theme.darkText}`}>
                          <Icon className="h-8 w-8" />
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-slate-900 dark:text-white mb-1">{item.name}</h4>
                          <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border shadow-sm ${item.urgency === 'Critical' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' : 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20'}`}>
                            {item.urgency}
                          </span>
                        </div>
                      </div>
                      
                      {progress < 100 ? (
                        <button 
                          onClick={() => setSelectedItem(item)}
                          className={`px-6 py-3 ${theme.bg} ${theme.hoverBg} text-white text-sm font-black rounded-2xl transition-all shadow-lg shadow-${item.color}-500/20 hover:scale-105 active:scale-95`}
                        >
                          Pledge
                        </button>
                      ) : (
                        <div className="px-5 py-3 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-black rounded-2xl flex items-center gap-2 border border-emerald-500/20 shadow-inner">
                          <CheckCircle2 className="h-4 w-4" /> Goal Met
                        </div>
                      )}
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-end mb-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Capacity</span>
                        <span className="text-lg font-black text-slate-900 dark:text-white">{item.pledged} <span className="text-slate-500 font-medium text-sm">/ {item.needed} units</span></span>
                      </div>
                      <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, ease: "circOut" }}
                          className={`h-full rounded-full ${progress >= 100 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : theme.bg}`}
                        ></motion.div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />

      <PledgeModal 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        item={selectedItem}
        onSuccess={handlePledgeSuccess}
      />
    </div>
  );
};

export default DonationsHub;
