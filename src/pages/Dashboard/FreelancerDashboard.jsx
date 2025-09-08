import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  DollarSign, 
  Briefcase, 
  TrendingUp,
  Star,
  Clock,
  CheckCircle,
  User,
  FileText,
  Target
} from 'lucide-react';
import { bidService, taskService, paymentService } from '../../services/api';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import Button from '../../components/UI/Button';

const FreelancerDashboard = () => {
  const [bids, setBids] = useState([]);
  const [activeTasks, setActiveTasks] = useState([]);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [bidsResponse, tasksResponse, paymentsResponse] = await Promise.all([
        bidService.getUserBids(),
        taskService.getUserTasks(),
        paymentService.getPaymentHistory()
      ]);

      const userBids = bidsResponse.data.data;
      const userTasks = tasksResponse.data.data.filter(t => t.status === 'IN_PROGRESS');
      const userPayments = paymentsResponse.data.data;

      setBids(userBids);
      setActiveTasks(userTasks);
      setPayments(userPayments);

      // Calculate stats
      const stats = {
        totalBids: userBids.length,
        activeTasks: userTasks.length,
        totalEarned: userPayments.reduce((sum, p) => sum + (p.status === 'COMPLETED' ? p.amount : 0), 0),
        acceptanceRate: userBids.length > 0 ? (userTasks.length / userBids.length * 100).toFixed(1) : 0
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Freelancer Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Track your projects and earnings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition hover:shadow-md hover:-translate-y-0.5 duration-200">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <Briefcase className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bids</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalBids}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition hover:shadow-md hover:-translate-y-0.5 duration-200">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 dark:bg-warning-900 rounded-lg">
              <Clock className="w-6 h-6 text-warning-600 dark:text-warning-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition hover:shadow-md hover:-translate-y-0.5 duration-200">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 dark:bg-success-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-success-600 dark:text-success-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earned</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalEarned?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition hover:shadow-md hover:-translate-y-0.5 duration-200">
          <div className="flex items-center">
            <div className="p-2 bg-accent-100 dark:bg-accent-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-accent-600 dark:text-accent-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.acceptanceRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Projects */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition hover:shadow-md duration-200">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Projects</h2>
          </div>
          <div className="p-6">
            {activeTasks.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">No active projects</p>
                <Link to="/tasks">
                  <Button>Browse Available Tasks</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activeTasks.map((task) => (
                  <div key={task.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg transition hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      ${task.budget.toLocaleString()} • Due {new Date(task.deadline).toLocaleDateString()}
                    </p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200">
                        In Progress
                      </span>
                      <Link to={`/tasks/${task.id}`}>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Bids */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition hover:shadow-md duration-200">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Bids</h2>
          </div>
          <div className="p-6">
            {bids.length === 0 ? (
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">No bids submitted yet</p>
                <Link to="/tasks">
                  <Button>Start Bidding on Tasks</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bids.slice(0, 5).map((bid) => (
                  <div key={bid.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg transition hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <h3 className="font-medium text-gray-900 dark:text-white">{bid.task.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Bid: ${bid.amount.toLocaleString()} • {bid.timeline}
                    </p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        bid.task.status === 'IN_PROGRESS' ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200' :
                        bid.task.status === 'OPEN' ? 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {bid.task.status === 'IN_PROGRESS' ? 'Accepted' : 'Pending'}
                      </span>
                      <Link to={`/tasks/${bid.task.id}`}>
                        <Button variant="ghost" size="sm">View Task</Button>
                      </Link>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link to="/tasks" className="group">
            <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20">
              <Search className="w-8 h-8 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 mx-auto mb-2" />
              <p className="text-center text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 font-medium">
                Browse Tasks
              </p>
            </div>
          </Link>

          <Link to="/profile" className="group">
            <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20">
              <User className="w-8 h-8 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 mx-auto mb-2" />
              <p className="text-center text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 font-medium">
                View Portfolio
              </p>
            </div>
          </Link>

          <Link to="/earnings" className="group">
            <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20">
              <DollarSign className="w-8 h-8 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 mx-auto mb-2" />
              <p className="text-center text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 font-medium">
                Track Earnings
              </p>
            </div>
          </Link>

          <Link to="/profile" className="group">
            <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20">
              <Target className="w-8 h-8 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 mx-auto mb-2" />
              <p className="text-center text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 font-medium">
                Update Skills
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;