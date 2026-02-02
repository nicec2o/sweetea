export default function PageHeader({ 
  title, 
  subtitle,
  onRefresh, 
  refreshLabel = '새로고침',
  actions,
  children 
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
        )}
      </div>
      
      <div className="flex gap-2 flex-wrap">
        {children}
        {actions}
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {refreshLabel}
          </button>
        )}
      </div>
    </div>
  );
}
