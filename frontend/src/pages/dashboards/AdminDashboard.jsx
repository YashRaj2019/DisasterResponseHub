import { useState, useEffect } from 'react';
import { ShieldAlert, Users, Activity, Map as MapIcon, BarChart3, AlertTriangle, Loader2 } from 'lucide-react';
import axios from 'axios';
import MapComponent from '../../components/MapComponent';
import useSocket from '../../hooks/useSocket';
import AssignVolunteerModal from '../../components/AssignVolunteerModal';

const AdminDashboard = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const socket = useSocket();

  const fetchEmergencies = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiUrl}/api/emergencies`, {
        withCredentials: true
      });
      setEmergencies(res.data);
    } catch (error) {
      console.error('Error fetching emergencies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencies();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('newEmergency', (newReport) => {
        setEmergencies((prev) => [newReport, ...prev]);
      });

      socket.on('emergencyStatusUpdated', (updatedReport) => {
        setEmergencies((prev) => 
          prev.map((e) => e._id === updatedReport._id ? updatedReport : e)
        );
      });

      socket.on('taskStatusUpdated', () => {
        fetchEmergencies();
      });
    }

    return () => {
      if (socket) {
        socket.off('newEmergency');
        socket.off('emergencyStatusUpdated');
        socket.off('taskStatusUpdated');
      }
    };
  }, [socket]);

  // Map data
  const mapCenter = [20.5937, 78.9629]; 
  const mapMarkers = emergencies.map(e => ({
    position: [...e.location.coordinates].reverse(), 
    type: 'emergency',
    title: e.title,
    description: e.severity
  }));

  const activeEmergenciesCount = emergencies.filter(e => e.status !== 'Resolved').length;

  const handleDispatchClick = (emergency) => {
    setSelectedEmergency(emergency);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {selectedEmergency && (
        <AssignVolunteerModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          emergency={selectedEmergency}
          onAssigned={fetchEmergencies}
        />
      )}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Command Center</h1>
        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchEmergencies}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Active Emergencies', value: activeEmergenciesCount, icon: <AlertTriangle className="h-6 w-6 text-emergency-red" />, bg: 'bg-emergency-red/10' },
          { title: 'Volunteers Active', value: '45', icon: <Users className="h-6 w-6 text-primary" />, bg: 'bg-primary/10' },
          { title: 'Shelters Available', value: '12', icon: <ShieldAlert className="h-6 w-6 text-emerald-500" />, bg: 'bg-emerald-500/10' },
          { title: 'Total Incidents', value: emergencies.length, icon: <Activity className="h-6 w-6 text-emergency-orange" />, bg: 'bg-emergency-orange/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-slate-200 dark:border-dark-700 shadow-sm flex items-center">
            <div className={`${stat.bg} p-3 rounded-xl mr-4`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-slate-200 dark:border-dark-700 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                <Activity className="mr-2 text-primary" />
                Live Incident Feed
              </h2>
              <span className="text-xs font-medium bg-slate-100 dark:bg-dark-900 text-slate-500 px-3 py-1 rounded-full">Real-time Enabled</span>
            </div>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin text-primary h-10 w-10" />
                </div>
              ) : emergencies.length > 0 ? (
                emergencies.map((e) => (
                  <div key={e._id} className="flex items-start p-4 bg-slate-50 dark:bg-dark-900 rounded-xl border border-slate-100 dark:border-dark-700 hover:shadow-md transition-shadow">
                    <div className={`${e.severity === 'Critical' ? 'bg-emergency-red/10' : 'bg-primary/10'} p-2 rounded-lg mr-4 mt-1`}>
                      <AlertTriangle className={`h-5 w-5 ${e.severity === 'Critical' ? 'text-emergency-red' : 'text-primary'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900 dark:text-white">{e.title}</h4>
                        <span className="text-xs text-slate-400">{new Date(e.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1 mb-3">{e.description}</p>
                      <div className="flex items-center space-x-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          e.severity === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {e.severity}
                        </span>
                        <button 
                          onClick={() => handleDispatchClick(e)}
                          className="text-xs font-bold text-primary hover:underline"
                        >
                          Dispatch Responders
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <p>No incidents reported yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Analytics & Mini Map */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-slate-200 dark:border-dark-700 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <MapIcon className="mr-2 text-primary" />
              Incident Hotspots
            </h3>
            <div className="h-64 bg-slate-100 dark:bg-dark-900 rounded-xl border border-slate-200 dark:border-dark-700 overflow-hidden relative z-0">
              <MapComponent 
                center={mapMarkers.length > 0 ? mapMarkers[0].position : mapCenter} 
                zoom={10} 
                markers={mapMarkers} 
                height="100%" 
              />
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-slate-200 dark:border-dark-700 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <BarChart3 className="mr-2 text-primary" />
              Resource Allocation
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-300">Medical Units</span>
                  <span className="font-medium">85% Deployed</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-dark-900 rounded-full h-2">
                  <div className="bg-emergency-orange h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-300">Rescue Vehicles</span>
                  <span className="font-medium">40% Deployed</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-dark-900 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
