/**
 * PageHeader 컴포넌트
 * 
 * @description 페이지 헤더 (제목 + 액션 버튼)
 */

export default function PageHeader({
  title,
  subtitle,
  actionButton,
  children
}) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-gray-600">{subtitle}</p>
        )}
        {children}
      </div>
      {actionButton && (
        <div>
          {actionButton}
        </div>
      )}
    </div>
  )
}
