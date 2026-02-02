export default function StatCard({
  title,
  value,
  icon,
  iconBg = 'bg-blue-500',
  trend,
  trendValue,
  subtitle,
  className = ''
}) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600'
  };

  const trendIcons = {
    up: '↑',
    down: '↓'
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900">
            {value}
          </p>
          
          {(trend || subtitle) && (
            <div className="mt-2 flex items-center text-sm">
              {trend && trendValue && (
                <span className={`font-medium ${trendColors[trend]}`}>
                  {trendIcons[trend]} {trendValue}
                </span>
              )}
              {subtitle && (
                <span className={`${trend ? 'ml-2' : ''} text-gray-500`}>
                  {subtitle}
                </span>
              )}
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`${iconBg} rounded-full p-3 text-white text-2xl`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
