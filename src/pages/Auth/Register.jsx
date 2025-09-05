import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import { 
  Users, 
  Briefcase, 
  Mail, 
  ArrowRight, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  FileText,
  Sparkles,
  CheckCircle
} from 'lucide-react';
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
  const [focusedField, setFocusedField] = useState(null);
  const [clickedElements, setClickedElements] = useState(new Set());

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const selectedRole = watch('role');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleElementClick = (elementId) => {
    setClickedElements(prev => new Set([...prev, elementId]));
    // Remove the click effect after animation
    setTimeout(() => {
      setClickedElements(prev => {
        const newSet = new Set(prev);
        newSet.delete(elementId);
        return newSet;
      });
    }, 600);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Process skills if provided
      if (data.skills) {
        data.skills = data.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      }
      
      const response = await authService.register(data);
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
      <style jsx>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(4); opacity: 0; }
        }
        @keyframes slideInUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .sparkle-effect {
          animation: sparkle 0.6s ease-in-out;
        }
        .ripple-effect::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 4px;
          height: 4px;
          background: rgba(59, 130, 246, 0.5);
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          animation: ripple 0.6s ease-out;
        }
        .slide-in {
          animation: slideInUp 0.5s ease-out;
        }
        .form-field {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .form-field:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .role-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .role-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15);
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8 slide-in">
          {/* Header with sparkle animation */}
          <div className="text-center relative">
            <div className="absolute -top-2 -right-2">
              <Sparkles className={`w-6 h-6 text-primary-500 ${clickedElements.has('header') ? 'sparkle-effect' : ''}`} />
            </div>
            <h2 
              className="text-3xl font-bold text-gray-900 dark:text-white cursor-pointer"
              onClick={() => handleElementClick('header')}
            >
              Join SkillLink ✨
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Create your account and start connecting
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
              {/* Role Selection with enhanced animation */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  I want to:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label 
                    className="relative cursor-pointer role-card"
                    onClick={() => handleElementClick('client-role')}
                  >
                    <input
                      {...register('role', { required: 'Please select a role' })}
                      type="radio"
                      value="CLIENT"
                      className="sr-only peer"
                    />
                    <div className={`relative p-6 border-2 border-gray-200 dark:border-gray-600 rounded-xl transition-all duration-300 peer-checked:border-primary-500 peer-checked:bg-gradient-to-br peer-checked:from-primary-50 peer-checked:to-primary-100 dark:peer-checked:from-primary-900/20 dark:peer-checked:to-primary-800/20 hover:border-gray-300 dark:hover:border-gray-500 ${clickedElements.has('client-role') ? 'ripple-effect' : ''}`}>
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-secondary-900 dark:to-secondary-800 rounded-full flex items-center justify-center peer-checked:from-primary-100 peer-checked:to-primary-200 dark:peer-checked:from-primary-800 dark:peer-checked:to-primary-700 shadow-lg">
                          <Briefcase className="w-7 h-7 text-secondary-600 dark:text-secondary-400 peer-checked:text-primary-600 dark:peer-checked:text-primary-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">I'm a Client</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Hire freelancers for my projects
                          </p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-primary-500 opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
                      </div>
                    </div>
                  </label>

                  <label 
                    className="relative cursor-pointer role-card"
                    onClick={() => handleElementClick('freelancer-role')}
                  >
                    <input
                      {...register('role', { required: 'Please select a role' })}
                      type="radio"
                      value="FREELANCER"
                      className="sr-only peer"
                    />
                    <div className={`relative p-6 border-2 border-gray-200 dark:border-gray-600 rounded-xl transition-all duration-300 peer-checked:border-primary-500 peer-checked:bg-gradient-to-br peer-checked:from-primary-50 peer-checked:to-primary-100 dark:peer-checked:from-primary-900/20 dark:peer-checked:to-primary-800/20 hover:border-gray-300 dark:hover:border-gray-500 ${clickedElements.has('freelancer-role') ? 'ripple-effect' : ''}`}>
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-accent-100 to-accent-200 dark:from-accent-900 dark:to-accent-800 rounded-full flex items-center justify-center peer-checked:from-primary-100 peer-checked:to-primary-200 dark:peer-checked:from-primary-800 dark:peer-checked:to-primary-700 shadow-lg">
                          <Users className="w-7 h-7 text-accent-600 dark:text-accent-400 peer-checked:text-primary-600 dark:peer-checked:text-primary-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">I'm a Freelancer</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Work on exciting projects
                          </p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-primary-500 opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
                      </div>
                    </div>
                  </label>
                </div>
                {errors.role && (
                  <p className="mt-2 text-sm text-error-600">{errors.role.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Full Name */}
                <div className="form-field">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className={`h-5 w-5 transition-colors duration-200 ${focusedField === 'name' ? 'text-primary-500' : 'text-gray-400'}`} />
                    </div>
                    <input
                      {...register('name', { 
                        required: 'Name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters'
                        }
                      })}
                      type="text"
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      onClick={() => handleElementClick('name-field')}
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-2 text-sm text-error-600">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="form-field">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className={`h-5 w-5 transition-colors duration-200 ${focusedField === 'email' ? 'text-primary-500' : 'text-gray-400'}`} />
                    </div>
                    <input
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      type="email"
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      onClick={() => handleElementClick('email-field')}
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-error-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Password with toggle */}
                <div className="form-field">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className={`h-5 w-5 transition-colors duration-200 ${focusedField === 'password' ? 'text-primary-500' : 'text-gray-400'}`} />
                    </div>
                    <input
                      {...register('password', { 
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                      type={showPassword ? 'text' : 'password'}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      onClick={() => handleElementClick('password-field')}
                      className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-error-600">{errors.password.message}</p>
                  )}
                </div>

                {/* Bio */}
                <div className="form-field">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex pointer-events-none">
                      <FileText className={`h-5 w-5 transition-colors duration-200 ${focusedField === 'bio' ? 'text-primary-500' : 'text-gray-400'}`} />
                    </div>
                    <textarea
                      {...register('bio')}
                      rows={3}
                      onFocus={() => setFocusedField('bio')}
                      onBlur={() => setFocusedField(null)}
                      onClick={() => handleElementClick('bio-field')}
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                      placeholder={selectedRole === 'CLIENT' ? 'Tell us about your business...' : 'Tell us about your skills and experience...'}
                    />
                  </div>
                </div>

                {/* Skills (conditional) */}
                {selectedRole === 'FREELANCER' && (
                  <div className="form-field slide-in">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Skills (comma-separated)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Sparkles className={`h-5 w-5 transition-colors duration-200 ${focusedField === 'skills' ? 'text-primary-500' : 'text-gray-400'}`} />
                      </div>
                      <input
                        {...register('skills')}
                        type="text"
                        onFocus={() => setFocusedField('skills')}
                        onBlur={() => setFocusedField(null)}
                        onClick={() => handleElementClick('skills-field')}
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                        placeholder="e.g. React, Node.js, Design"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Enter your main skills separated by commas
                    </p>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                loading={isLoading}
                className="w-full transform transition-all duration-200 hover:scale-105 active:scale-95"
                size="lg"
                onClick={() => handleElementClick('submit-btn')}
              >
                {isLoading ? 'Creating Account...' : 'Create Account ✨'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium transition-colors duration-200 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Email Verification Modal */}
      <Modal
        isOpen={showVerification}
        onClose={() => {}}
        title="Verify Your Email"
        maxWidth="max-w-md"
      >
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Mail className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            We've sent a 6-digit verification code to your email address. Please enter it below to complete your registration.
          </p>
        </div>

        <form onSubmit={handleVerification} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
              Verification Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-4 text-center text-2xl font-mono border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white tracking-widest transition-all duration-200 shadow-sm"
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
              className="flex-1 transform transition-all duration-200 hover:scale-105"
            >
              {isResending ? 'Sending...' : 'Resend Code'}
            </Button>
            <Button
              type="submit"
              loading={isVerifying}
              className="flex-1 transform transition-all duration-200 hover:scale-105"
            >
              {isVerifying ? 'Verifying...' : 'Verify Email'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Register;