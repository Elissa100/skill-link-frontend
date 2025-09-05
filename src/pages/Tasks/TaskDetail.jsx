import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  DollarSign, 
  User, 
  MessageCircle,
  Clock,
  FileText,
  Users,
  Send,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { taskService, bidService, messageService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const TaskDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { joinTaskRoom, leaveTaskRoom, sendMessage, onNewMessage, offNewMessage } = useSocket();

  const [task, setTask] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showBids, setShowBids] = useState(false);
  const [bidForm, setBidForm] = useState({
    proposal: '',
    amount: '',
    timeline: ''
  });
  const [submittingBid, setSubmittingBid] = useState(false);

  useEffect(() => {
    fetchTaskDetails();
    fetchMessages();
  }, [id]);

  useEffect(() => {
    if (task) {
      joinTaskRoom(id);
      onNewMessage(handleNewMessage);

      return () => {
        leaveTaskRoom(id);
        offNewMessage(handleNewMessage);
      };
    }
  }, [task]);

  const fetchTaskDetails = async () => {
    try {
      const response = await taskService.getTaskById(id);
      setTask(response.data.data);
    } catch (error) {
      console.error('Failed to fetch task details:', error);
      navigate('/tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await messageService.getTaskMessages(id);
      setMessages(response.data.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleNewMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      sendMessage(id, newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    setSubmittingBid(true);
    try {
      await bidService.createBid(id, {
        ...bidForm,
        amount: parseFloat(bidForm.amount)
      });
      setShowBidModal(false);
      setBidForm({ proposal: '', amount: '', timeline: '' });
      toast.success('Bid submitted successfully!');
      fetchTaskDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit bid');
    } finally {
      setSubmittingBid(false);
    }
  };

  const handleAcceptBid = async (bidId) => {
    try {
      await bidService.acceptBid(bidId);
      toast.success('Bid accepted successfully!');
      fetchTaskDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept bid');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Task Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The task you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => navigate('/tasks')}>Back to Tasks</Button>
        </div>
      </div>
    );
  }

  const canBid = user?.role === 'FREELANCER' && task.status === 'OPEN' && 
                !task.bids?.some(bid => bid.freelancerId === user.id);
  const isTaskOwner = user?.id === task.clientId;
  const hasAcceptedBid = task.bids?.some(bid => bid.freelancerId === user.id) && task.status !== 'OPEN';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{task.title}</h1>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    task.status === 'OPEN' ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200' :
                    task.status === 'IN_PROGRESS' ? 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200' :
                    task.status === 'COMPLETED' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
                
                {canBid && (
                  <Button onClick={() => setShowBidModal(true)}>
                    Submit Bid
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-6 mb-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold">${task.budget.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Due {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{task.bids?.length || 0} bids</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Posted {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{task.description}</p>
              </div>

              {/* Attachments */}
              {task.attachments && task.attachments.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Attachments</h3>
                  <div className="space-y-2">
                    {task.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">{attachment.originalname}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({(attachment.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bids Section */}
          {(isTaskOwner || hasAcceptedBid) && task.bids && task.bids.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowBids(!showBids)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Bids ({task.bids.length})
                  </h2>
                  {showBids ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
              
              {showBids && (
                <div className="p-6">
                  <div className="space-y-6">
                    {task.bids.map((bid) => (
                      <div key={bid.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center">
                              {bid.freelancer.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">{bid.freelancer.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                ${bid.amount.toLocaleString()} • {bid.timeline}
                              </p>
                            </div>
                          </div>
                          {isTaskOwner && task.status === 'OPEN' && (
                            <Button
                              size="sm"
                              onClick={() => handleAcceptBid(bid.id)}
                            >
                              Accept Bid
                            </Button>
                          )}
                        </div>
                        
                        <p className="text-gray-700 dark:text-gray-300 mb-3">{bid.proposal}</p>
                        
                        {bid.freelancer.skills && (
                          <div className="flex flex-wrap gap-2">
                            {(Array.isArray(bid.freelancer.skills) ? bid.freelancer.skills : []).map((skill, index) => (
                              <span key={index} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Client</h3>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center">
                {task.client.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{task.client.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{task.client.email}</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          {(isTaskOwner || hasAcceptedBid) && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Messages
                </h3>
              </div>
              
              <div className="h-64 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No messages yet. Start the conversation!
                  </p>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.senderId === user.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === user.id
                            ? 'text-primary-200'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {message.sender.name} • {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <Button type="submit" size="sm">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Task Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Task Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Budget:</span>
                <span className="font-medium text-gray-900 dark:text-white">${task.budget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Deadline:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(task.deadline).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Bids:</span>
                <span className="font-medium text-gray-900 dark:text-white">{task.bids?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Posted:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bid Modal */}
      <Modal
        isOpen={showBidModal}
        onClose={() => setShowBidModal(false)}
        title="Submit Your Bid"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmitBid} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Proposal
            </label>
            <textarea
              value={bidForm.proposal}
              onChange={(e) => setBidForm(prev => ({ ...prev, proposal: e.target.value }))}
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Describe your approach and why you're the right fit for this project..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bid Amount ($)
              </label>
              <input
                type="number"
                value={bidForm.amount}
                onChange={(e) => setBidForm(prev => ({ ...prev, amount: e.target.value }))}
                min="1"
                step="0.01"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timeline
              </label>
              <input
                type="text"
                value={bidForm.timeline}
                onChange={(e) => setBidForm(prev => ({ ...prev, timeline: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="e.g. 2 weeks"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowBidModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={submittingBid}
            >
              Submit Bid
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TaskDetail;