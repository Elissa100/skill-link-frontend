import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/UI/Button';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const from = location.state?.from?.pathname || '/dashboard';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Login successful!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      if (errorMessage.includes('verify your email')) {
        toast.error('Please verify your email before logging in. Check your inbox for the verification code.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 via-secondary-100 to-primary-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background blob */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-primary-300 opacity-30 rounded-full blur-3xl z-0"></div>
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-secondary-300 opacity-20 rounded-full blur-3xl z-0"></div>

      <div className="max-w-md w-full space-y-8 z-10">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-tr from-primary-600 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-slow">
              <span className="text-white font-extrabold text-4xl tracking-widest">S</span>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white drop-shadow">
            Welcome back to <span className="text-primary-600 dark:text-primary-400">SkillLink</span>
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-base">
            Sign in to your account
          </p>
        </div>

        <div className="bg-white/90 dark:bg-gray-800/90 p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 backdrop-blur">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiMail />
                </span>
                <input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  className="pl-10 pr-3 py-2 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiLock />
                </span>
                <input
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  type="password"
                  className="pl-10 pr-3 py-2 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-error-600">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              loading={isLoading}
              className="w-full transition hover:scale-105 duration-150"
              size="lg"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-gray-800 px-3 text-gray-500 dark:text-gray-400 font-semibold tracking-wide">
                  Demo Accounts
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="bg-primary-50 dark:bg-gray-700/50 border border-primary-200 dark:border-gray-600 rounded-lg p-3 flex items-center gap-2">
                <FiUser className="text-primary-600 dark:text-primary-400" />
                <span className="font-medium">Admin:</span>
                <span className="ml-auto text-gray-700 dark:text-gray-200">admin@skilllink.dev / Admin123!</span>
              </div>
              <div className="bg-secondary-50 dark:bg-gray-700/50 border border-secondary-200 dark:border-gray-600 rounded-lg p-3 flex items-center gap-2">
                <FiUser className="text-secondary-600 dark:text-secondary-400" />
                <span className="font-medium">Client:</span>
                <span className="ml-auto text-gray-700 dark:text-gray-200">client@skilllink.dev / Client123!</span>
              </div>
              <div className="bg-green-50 dark:bg-gray-700/50 border border-green-200 dark:border-gray-600 rounded-lg p-3 flex items-center gap-2">
                <FiUser className="text-green-600 dark:text-green-400" />
                <span className="font-medium">Freelancer:</span>
                <span className="ml-auto text-gray-700 dark:text-gray-200">freelancer@skilllink.dev / Freelancer123!</span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-semibold underline underline-offset-2 transition"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;