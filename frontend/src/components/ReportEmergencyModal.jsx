import { useState } from 'react';
import { X, AlertTriangle, MapPin, Camera, Loader2 } from 'lucide-react';
import axios from 'axios';

const ReportEmergencyModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    disasterType: 'Medical',
    severity: 'Medium',
    location: null
  });
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');

  const handleGetLocation = () => {
    setLocating(true);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          location: {
            type: 'Point',
            coordinates: [position.coords.longitude, position.coords.latitude],
            address: 'Detected Location'
          }
        });
        setLocating(false);
      },
      () => {
        setError('Unable to retrieve your location');
        setLocating(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location) {
      setError('Please provide your location');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:5000/api/emergencies', formData, {
        withCredentials: true
      });
      setFormData({
        title: '',
        description: '',
        disasterType: 'Medical',
        severity: 'Medium',
        location: null
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to report emergency');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-dark-700">
          <div className="flex items-center text-emergency-red">
            <AlertTriangle className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-bold">Report Emergency</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-dark-700 rounded-full transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-800 text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Emergency Title</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white"
              placeholder="Brief title (e.g., Building Fire, Heart Attack)"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea
              required
              rows="3"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white"
              placeholder="Describe the situation..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Disaster Type</label>
              <select
                className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white appearance-none"
                value={formData.disasterType}
                onChange={(e) => setFormData({ ...formData, disasterType: e.target.value })}
              >
                <option value="Medical">Medical</option>
                <option value="Fire">Fire</option>
                <option value="Flood">Flood</option>
                <option value="Earthquake">Earthquake</option>
                <option value="Hurricane">Hurricane</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Severity</label>
              <select
                className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white appearance-none"
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locating}
              className={`w-full flex items-center justify-center py-3 px-4 border rounded-xl font-medium transition-all ${
                formData.location 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' 
                : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-dark-900 dark:border-dark-700 dark:text-slate-400 hover:border-primary'
              }`}
            >
              {locating ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <MapPin className="h-5 w-5 mr-2" />}
              {formData.location ? 'Location Captured' : locating ? 'Locating...' : 'Get My Current Location'}
            </button>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-slate-200 dark:border-dark-700 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-emergency-red hover:bg-red-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-emergency-red/30 flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : 'Report Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportEmergencyModal;
