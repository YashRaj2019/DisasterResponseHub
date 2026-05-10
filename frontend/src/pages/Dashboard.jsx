import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import CitizenDashboard from './dashboards/CitizenDashboard';
import VolunteerDashboard from './dashboards/VolunteerDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  if (!userInfo) return null;

  // If we are at exactly /dashboard, show the role-based overview
  const isOverview = location.pathname === '/dashboard' || location.pathname === '/dashboard/';

  const renderOverview = () => {
    switch (userInfo.role) {
      case 'Citizen': return <CitizenDashboard />;
      case 'Volunteer': return <VolunteerDashboard />;
      case 'Admin': return <AdminDashboard />;
      default: return <CitizenDashboard />;
    }
  };

  return (
    <DashboardLayout>
      {isOverview ? renderOverview() : <Outlet />}
    </DashboardLayout>
  );
};

export default Dashboard;
