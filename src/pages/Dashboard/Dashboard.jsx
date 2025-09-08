import { useAuth } from '../../context/AuthContext';
import ClientDashboard from './ClientDashboard';
import FreelancerDashboard from './FreelancerDashboard';
import AdminDashboard from './AdminDashboard';
import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 px-4">
          <div className="text-center bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-lg max-w-md w-full">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-error-100 dark:bg-error-900 flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-error-600 dark:text-error-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">You don't have permission to access the dashboard.</p>
            <Link to="/">
              <button className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800">
                Go Home
              </button>
            </Link>
          </div>
        </div>
      );
  }
};

export default Dashboard;