import { useState, useEffect } from 'react';
import { X, User, Send, Loader2 } from 'lucide-react';
import axios from 'axios';

const AssignVolunteerModal = ({ isOpen, onClose, emergency, onAssigned }) => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState('');
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    if (isOpen) {
      const fetchVolunteers = async () => {
        setLoading(true);
        try {
          const res = await axios.get('http://localhost:5000/api/auth/volunteers', { withCredentials: true });
          setVolunteers(res.data);
        } catch (error) {
          console.error('Error fetching volunteers:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchVolunteers();
    }
  }, [isOpen]);

  const handleAssign = async () => {
    if (!selectedVolunteer) return;
    setAssigning(true);
    try {
      await axios.post('http://localhost:5000/api/tasks', {
        volunteerId: selectedVolunteer,
        emergencyId: emergency._id,
        instructions
      }, { withCredentials: true });
      
      onAssigned();
      onClose();
    } catch (error) {
      alert('Failed to assign volunteer');
    } finally {
      setAssigning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-dark-700">
          <h2 className="text-xl font-bold dark:text-white">Dispatch Responder</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-dark-700 rounded-full transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-slate-50 dark:bg-dark-900 p-4 rounded-xl border border-slate-100 dark:border-dark-700">
            <p className="text-xs font-bold text-primary uppercase mb-1">Target Emergency</p>
            <p className="font-bold text-slate-800 dark:text-slate-200">{emergency.title}</p>
            <p className="text-sm text-slate-500">{emergency.location.address}</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Select Available Volunteer</label>
            {loading ? (
              <div className="flex justify-center py-4"><Loader2 className="animate-spin text-primary" /></div>
            ) : (
              <select 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl outline-none dark:text-white focus:ring-2 focus:ring-primary"
                value={selectedVolunteer}
                onChange={(e) => setSelectedVolunteer(e.target.value)}
              >
                <option value="">-- Choose a Volunteer --</option>
                {volunteers.map(v => (
                  <option key={v._id} value={v._id}>{v.name} ({v.phone || 'No phone'})</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Instructions (Optional)</label>
            <textarea 
              className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl outline-none dark:text-white focus:ring-2 focus:ring-primary"
              placeholder="e.g. Bring medical kit, proceed via North exit..."
              rows="3"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            ></textarea>
          </div>

          <button
            onClick={handleAssign}
            disabled={assigning || !selectedVolunteer}
            className="w-full bg-primary hover:bg-primary-dark disabled:bg-slate-300 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/30 flex items-center justify-center"
          >
            {assigning ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 h-5 w-5" />}
            Confirm Dispatch
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignVolunteerModal;
