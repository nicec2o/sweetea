/**
 * LoadingSpinner 컴포넌트
 * 
 * @description 로딩 중임을 나타내는 스피너 컴포넌트
 * 
 * @param {Object} props
 * @param {string} props.size - 스피너 크기 (sm, md, lg)
 * @param {string} props.text - 로딩 메시지 (선택사항)
 */

export default function LoadingSpinner({ size = 'md', text = '' }) {
  // 크기별 클래스 매핑
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* 스피너 애니메이션 */}
      <div 
        className={`inline-block animate-spin rounded-full border-b-2 border-primary-500 ${sizeClasses[size]}`}
      />
      
      {/* 로딩 메시지 (있는 경우) */}
      {text && (
        <p className="mt-4 text-gray-600">{text}</p>
      )}
    </div>
  )
}
