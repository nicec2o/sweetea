export default function LoadingSpinner({ 
  message = '로딩중...', 
  size = 'md',
  fullScreen = false 
}) {
  const sizeClasses = {
    sm: 'h-32',
    md: 'h-64',
    lg: 'h-96'
  };

  const spinnerSizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const containerClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50'
    : `flex justify-center items-center ${sizeClasses[size]}`;

  return (
    <div className={containerClass}>
      <div className="text-center">
        <div className={`${spinnerSizes[size]} mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
        {message && (
          <div className="text-xl text-gray-600">{message}</div>
        )}
      </div>
    </div>
  );
}
