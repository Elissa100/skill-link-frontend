import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import { Users, Briefcase, Mail, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const { login, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [userId, setUserId] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const selectedRole = watch('role');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Prepare data for backend
      const registrationData = {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
        bio: data.bio || '',
        skills: data.skills ? data.skills.split(',').map(skill => skill.trim()).filter(skill => skill) : [],
        portfolioLinks: data.portfolioLinks ? data.portfolioLinks.split(',').map(link => link.trim()).filter(link => link) : []
      };
      
      const response = await authService.register(registrationData);
      setUserId(response.data.data.user.id);
      setShowVerification(true);
      toast.success('Registration successful! Please check your email for verification code.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setIsVerifying(true);
    try {
      const response = await authService.verifyEmail(userId, verificationCode);
      
      // Store tokens and login user
      localStorage.setItem('token', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
      
      // Update auth context
      await login(response.data.data.user.email, 'verified'); // Special case for verified users
      
      toast.success('Email verified successfully! Welcome to SkillLink!');
      setShowVerification(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      await authService.resendVerification(userId);
      toast.success('Verification code sent! Please check your email.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Join SkillLink
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Create your account and start connecting
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  I want to:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="relative cursor-pointer">
                    <input
                      {...register('role', { required: 'Please select a role' })}
                      type="radio"
                      value="CLIENT"
                      className="sr-only peer"
                    />
                    <div className="p-6 border-2 border-gray-200 dark:border-gray-600 rounded-lg transition-all duration-200 peer-checked:border-primary-500 peer-checked:bg-primary-50 dark:peer-checked:bg-primary-900/20 hover:border-gray-300 dark:hover:border-gray-500">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900 rounded-full flex items-center justify-center peer-checked:bg-primary-100 dark:peer-checked:bg-primary-800">
                          <Briefcase className="w-6 h-6 text-secondary-600 dark:text-secondary-400 peer-checked:text-primary-600 dark:peer-checked:text-primary-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">I'm a Client</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Hire freelancers for my projects
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>

                  <label className="relative cursor-pointer">
                    <input
                      {...register('role', { required: 'Please select a role' })}
                      type="radio"
                      value="FREELANCER"
                      className="sr-only peer"
                    />
                    <div className="p-6 border-2 border-gray-200 dark:border-gray-600 rounded-lg transition-all duration-200 peer-checked:border-primary-500 peer-checked:bg-primary-50 dark:peer-checked:bg-primary-900/20 hover:border-gray-300 dark:hover:border-gray-500">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900 rounded-full flex items-center justify-center peer-checked:bg-primary-100 dark:peer-checked:bg-primary-800">
                          <Users className="w-6 h-6 text-accent-600 dark:text-accent-400 peer-checked:text-primary-600 dark:peer-checked:text-primary-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">I'm a Freelancer</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Work on exciting projects
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
                {errors.role && (
                  <p className="mt-2 text-sm text-error-600">{errors.role.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <input
                    {...register('name', { 
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters'
                      }
                    })}
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <input
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <input
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    type="password"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Create a password"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-error-600">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bio
                  </label>
                  <textarea
                    {...register('bio')}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder={selectedRole === 'CLIENT' ? 'Tell us about your business...' : 'Tell us about your skills and experience...'}
                  />
                </div>

                {selectedRole === 'FREELANCER' && (
                  <>
                  <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Skills (comma-separated)
                    </label>
                    <input
                      {...register('skills')}
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="e.g. React, Node.js, Design"
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Enter your main skills separated by commas
                    </p>
                  </div>

                  <div>
                    <label htmlFor="portfolioLinks" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Portfolio Links (comma-separated)
                    </label>
                    <input
                      {...register('portfolioLinks')}
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="e.g. https://github.com/username, https://portfolio.com"
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Enter your portfolio URLs separated by commas
                    </p>
                  </div>
                  </>
                )}
              </div>

              <Button
                type="submit"
                loading={isLoading}
                className="w-full"
                size="lg"
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Email Verification Modal */}
      <Modal
        isOpen={showVerification}
        onClose={() => {}}
        title="Verify Your Email"
        maxWidth="max-w-md"
      >
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
          </div>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
          </div>
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We've sent a 6-digit verification code to your email address. Please enter it below to complete your registration.
          </p>
        </div>

        <form onSubmit={handleVerification} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white tracking-widest"
              placeholder="000000"
              maxLength={6}
            />
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleResendCode}
              loading={isResending}
              className="flex-1"
            >
              Resend Code
            </Button>
            <Button
              type="submit"
              loading={isVerifying}
              className="flex-1"
            >
              Verify Email
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Register;
