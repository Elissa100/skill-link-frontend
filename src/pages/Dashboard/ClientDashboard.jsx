import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Briefcase, 
  DollarSign, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { taskService, paymentService } from '../../services/api';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import Button from '../../components/UI/Button';

const ClientDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [tasksResponse, paymentsResponse] = await Promise.all([
        taskService.getUserTasks(),
        paymentService.getPaymentHistory()
      ]);

      const userTasks = tasksResponse.data.data;
      const userPayments = paymentsResponse.data.data;

      setTasks(userTasks);
      setPayments(userPayments);

      // Calculate stats
      const stats = {
        totalTasks: userTasks.length,
        activeTasks: userTasks.filter(t => t.status === 'IN_PROGRESS').length,
        completedTasks: userTasks.filter(t => t.status === 'COMPLETED').length,
        totalSpent: userPayments.reduce((sum, p) => sum + (p.status === 'COMPLETED' ? p.amount : 0), 0),
        pendingPayments: userPayments.filter(p => p.status === 'PENDING').length
      };
      setStats(stats);

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Client Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your projects and track progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <Briefcase className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 dark:bg-warning-900 rounded-lg">
              <Clock className="w-6 h-6 text-warning-600 dark:text-warning-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Tasks</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 dark:bg-success-900 rounded-lg">
              <CheckCircle className="w-6 h-6 text-success-600 dark:text-success-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-secondary-100 dark:bg-secondary-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalSpent?.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Tasks</h2>
              <Link to="/tasks/create">
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Task
                </Button>
              </Link>
            </div>
          </div>
          <div className="p-6">
            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">No tasks yet</p>
                <Link to="/tasks/create">
                  <Button>Post Your First Task</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ${task.budget.toLocaleString()} • {task._count.bids} bids
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        task.status === 'OPEN' ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200' :
                        task.status === 'IN_PROGRESS' ? 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      <Link to={`/tasks/${task.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Payments</h2>
          </div>
          <div className="p-6">
            {payments.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No payments yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {payments.slice(0, 5).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {payment.task.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {payment.milestone?.description || 'Task payment'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ${payment.amount.toLocaleString()}
                      </p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        payment.status === 'COMPLETED' ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200' :
                        payment.status === 'PENDING' ? 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200' :
                        'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/tasks/create" className="group">
            <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20">
              <Plus className="w-8 h-8 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 mx-auto mb-2" />
              <p className="text-center text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 font-medium">
                Post New Task
              </p>
            </div>
          </Link>

          <Link to="/tasks" className="group">
            <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20">
              <Briefcase className="w-8 h-8 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 mx-auto mb-2" />
              <p className="text-center text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 font-medium">
                Manage Tasks
              </p>
            </div>
          </Link>

          <Link to="/payments" className="group">
            <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20">
              <DollarSign className="w-8 h-8 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 mx-auto mb-2" />
              <p className="text-center text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 font-medium">
                Payment History
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;