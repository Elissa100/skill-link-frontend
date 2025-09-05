const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`${sizes[size]} border-2 border-gray-200 border-t-primary-600 rounded-full animate-spin ${className}`} />
  );
};

export default LoadingSpinner;