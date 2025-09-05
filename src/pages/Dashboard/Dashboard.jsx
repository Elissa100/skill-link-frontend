import { useAuth } from '../../context/AuthContext';
import ClientDashboard from './ClientDashboard';
import FreelancerDashboard from './FreelancerDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'CLIENT':
      return <ClientDashboard />;
    case 'FREELANCER':
      return <FreelancerDashboard />;
    case 'ADMIN':
      return <AdminDashboard />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You don't have permission to access the dashboard.
            </p>
          </div>
        </div>
      );
  }
};

export default Dashboard;