import { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { userService, taskService, paymentService } from '../../services/api';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersResponse, tasksResponse, paymentsResponse] = await Promise.all([
        userService.getAllUsers(),
        taskService.getAllTasks({ page: 1, limit: 100 }),
        paymentService.getPaymentHistory()
      ]);

      const allUsers = usersResponse.data.data;
      const allTasks = tasksResponse.data.data.tasks;
      const allPayments = paymentsResponse.data.data;

      setUsers(allUsers);
      setTasks(allTasks);
      setPayments(allPayments);

      // Calculate comprehensive stats
      const stats = {
        totalUsers: allUsers.length,
        clients: allUsers.filter(u => u.role === 'CLIENT').length,
        freelancers: allUsers.filter(u => u.role === 'FREELANCER').length,
        totalTasks: allTasks.length,
        openTasks: allTasks.filter(t => t.status === 'OPEN').length,
        inProgressTasks: allTasks.filter(t => t.status === 'IN_PROGRESS').length,
        completedTasks: allTasks.filter(t => t.status === 'COMPLETED').length,
        totalRevenue: allPayments.reduce((sum, p) => sum + (p.status === 'COMPLETED' ? p.amount * 0.1 : 0), 0), // 10% platform fee
        totalPaid: allPayments.reduce((sum, p) => sum + (p.status === 'COMPLETED' ? p.amount : 0), 0)
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

  const taskStatusData = [
    { name: 'Open', value: stats.openTasks, color: '#22c55e' },
    { name: 'In Progress', value: stats.inProgressTasks, color: '#f59e0b' },
    { name: 'Completed', value: stats.completedTasks, color: '#3b82f6' }
  ];

  const userTypeData = [
    { name: 'Clients', value: stats.clients, color: '#14b8a6' },
    { name: 'Freelancers', value: stats.freelancers, color: '#f97316' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Platform overview and management
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-secondary-100 dark:bg-secondary-900 rounded-lg">
              <Briefcase className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 dark:bg-success-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-success-600 dark:text-success-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Platform Revenue</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalRevenue?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-accent-100 dark:bg-accent-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-accent-600 dark:text-accent-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Transactions</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalPaid?.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskStatusData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {taskStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Users</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {users.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.role === 'CLIENT' ? 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200' :
                    'bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Tasks</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    ${task.budget.toLocaleString()} • {task._count.bids} bids
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      task.status === 'OPEN' ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200' :
                      task.status === 'IN_PROGRESS' ? 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;