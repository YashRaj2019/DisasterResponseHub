import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LiveMap from './pages/dashboards/LiveMap';
import Alerts from './pages/dashboards/Alerts';
import Settings from './pages/dashboards/Settings';
import EmergencyContacts from './pages/dashboards/EmergencyContacts';
import SurvivalHub from './pages/dashboards/SurvivalHub';
import VolunteerNetwork from './pages/dashboards/VolunteerNetwork';
import DonationsHub from './pages/dashboards/DonationsHub';
import MissingPersons from './pages/dashboards/MissingPersons';
import PlatformImpact from './pages/dashboards/PlatformImpact';
import AICopilot from './pages/dashboards/AICopilot';
import ControlRoom from './pages/dashboards/ControlRoom';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 transition-colors duration-300">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="map" element={<LiveMap />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="contacts" element={<EmergencyContacts />} />
          <Route path="survival" element={<SurvivalHub />} />
          <Route path="volunteers" element={<VolunteerNetwork />} />
          <Route path="donations" element={<DonationsHub />} />
          <Route path="missing" element={<MissingPersons />} />
          <Route path="impact" element={<PlatformImpact />} />
          <Route path="copilot" element={<AICopilot />} />
          <Route path="control" element={<ControlRoom />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
