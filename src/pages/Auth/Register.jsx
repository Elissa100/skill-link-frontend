import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import { Users, Briefcase, Mail, ArrowRight } from 'lucide-react';
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock, FiFileText, FiTool, FiLink } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Register = () => {
  const { login, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [userId, setUserId] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register: formRegister, handleSubmit, watch, formState: { errors } } = useForm();

  const selectedRole = watch('role');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
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
      
      localStorage.setItem('token', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
      
      await login(response.data.data.user.email, 'verified');
      
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
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-tr from-primary-600 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-extrabold text-3xl tracking-widest">S</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Join <span className="text-primary-600 dark:text-primary-400">SkillLink</span>
            </h2>
            <div className="flex justify-center mt-2 mb-2">
              <span className="inline-block w-12 h-1 bg-primary-500 rounded"></span>
            </div>
            <p className="text-base text-gray-600 dark:text-gray-400">
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
                      {...formRegister('role', { required: 'Please select a role' })}
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
                      {...formRegister('role', { required: 'Please select a role' })}
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
                  <p className="mt-2 text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <div className="relative mt-1 group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-200 group-focus-within:scale-110 group-focus-within:text-green-500">
                      <FiUser className="w-5 h-5 text-gray-400 group-focus-within:text-green-500" />
                    </div>
                    <input
                      {...formRegister('name', { 
                        required: 'Name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters'
                        }
                      })}
                      type="text"
                      className="pl-12 pr-3 py-3 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent focus:scale-[1.02] dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-gray-400"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <div className="relative mt-1 group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-200 group-focus-within:scale-110 group-focus-within:text-blue-500">
                      <FiMail className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500" />
                    </div>
                    <input
                      {...formRegister('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      type="email"
                      className="pl-12 pr-3 py-3 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:scale-[1.02] dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-gray-400"
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative mt-1 group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-200 group-focus-within:scale-110 group-focus-within:text-purple-500">
                      <FiLock className="w-5 h-5 text-gray-400 group-focus-within:text-purple-500" />
                    </div>
                    <input
                      {...formRegister('password', { 
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                      type={showPassword ? "text" : "password"}
                      className="pl-12 pr-12 py-3 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:scale-[1.02] dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-gray-400"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 focus:outline-none transition-colors duration-200"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                  {watch('password') && (
                    <div className="mt-2">
                      {(() => {
                        const pwd = watch('password') || '';
                        let score = 0;
                        if (pwd.length >= 6) score += 1;
                        if (/[A-Z]/.test(pwd)) score += 1;
                        if (/[0-9]/.test(pwd)) score += 1;
                        if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
                        const strength = ['Weak', 'Fair', 'Good', 'Strong'][Math.max(0, score - 1)];
                        const widths = ['w-1/4', 'w-2/4', 'w-3/4', 'w-full'];
                        const colors = ['bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-600'];
                        return (
                          <div>
                            <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-600 rounded">
                              <div className={`h-1.5 ${widths[score-1] || 'w-1/4'} ${colors[score-1] || 'bg-red-500'} rounded transition-all`}></div>
                            </div>
                            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Strength: {strength}</p>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm Password
                  </label>
                  <div className="relative mt-1 group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-200 group-focus-within:scale-110 group-focus-within:text-purple-500">
                      <FiLock className="w-5 h-5 text-gray-400 group-focus-within:text-purple-500" />
                    </div>
                    <input
                      {...formRegister('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) => value === watch('password') || 'Passwords do not match'
                      })}
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="pl-12 pr-12 py-3 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:scale-[1.02] dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-gray-400"
                      placeholder="Re-enter your password"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 focus:outline-none transition-colors duration-200"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bio
                  </label>
                  <div className="relative mt-1 group">
                    <div className="absolute left-3 top-3 transition-all duration-200 group-focus-within:scale-110 group-focus-within:text-orange-500">
                      <FiFileText className="w-5 h-5 text-gray-400 group-focus-within:text-orange-500" />
                    </div>
                    <textarea
                      {...formRegister('bio')}
                      rows={3}
                      className="pl-12 pr-3 py-3 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:scale-[1.02] dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-gray-400 resize-none"
                      placeholder={selectedRole === 'CLIENT' ? 'Tell us about your business...' : 'Tell us about your skills and experience...'}
                    />
                  </div>
                </div>

                {selectedRole === 'FREELANCER' && (
                  <>
                  <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Skills (comma-separated)
                    </label>
                    <div className="relative mt-1 group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-200 group-focus-within:scale-110 group-focus-within:text-red-500">
                        <FiTool className="w-5 h-5 text-gray-400 group-focus-within:text-red-500" />
                      </div>
                      <input
                        {...formRegister('skills')}
                        type="text"
                        className="pl-12 pr-3 py-3 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-transparent focus:scale-[1.02] dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-gray-400"
                        placeholder="e.g. React, Node.js, Design"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Enter your main skills separated by commas
                    </p>
                  </div>

                  <div>
                    <label htmlFor="portfolioLinks" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Portfolio Links (comma-separated)
                    </label>
                    <div className="relative mt-1 group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-200 group-focus-within:scale-110 group-focus-within:text-teal-500">
                        <FiLink className="w-5 h-5 text-gray-400 group-focus-within:text-teal-500" />
                      </div>
                      <input
                        {...formRegister('portfolioLinks')}
                        type="text"
                        className="pl-12 pr-3 py-3 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:scale-[1.02] dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-gray-400"
                        placeholder="e.g. https://github.com/username, https://portfolio.com"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Enter your portfolio URLs separated by commas
                    </p>
                  </div>
                  </>
                )}
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    {...formRegister('terms', { required: 'You must accept the Terms to continue' })}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-700 dark:text-gray-300">
                    I agree to the <span className="underline cursor-pointer">Terms</span> and <span className="underline cursor-pointer">Privacy Policy</span>
                  </label>
                  {errors.terms && (
                    <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
                  )}
                </div>
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