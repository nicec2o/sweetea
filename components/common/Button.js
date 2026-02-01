/**
 * Button 컴포넌트
 * 
 * @description 재사용 가능한 버튼 컴포넌트
 * - 다양한 variant (primary, secondary, danger, ghost, outline)
 * - 다양한 size (sm, md, lg)
 * - 로딩 상태 지원
 * - 아이콘 지원
 * - disabled 상태
 * 
 * @param {Object} props
 * @param {'primary'|'secondary'|'danger'|'ghost'|'outline'|'success'} [props.variant='primary'] - 버튼 스타일 variant
 * @param {'sm'|'md'|'lg'} [props.size='md'] - 버튼 크기
 * @param {boolean} [props.loading=false] - 로딩 상태
 * @param {boolean} [props.disabled=false] - 비활성화 상태
 * @param {React.ReactNode} [props.icon] - 아이콘 (왼쪽)
 * @param {React.ReactNode} [props.iconRight] - 아이콘 (오른쪽)
 * @param {boolean} [props.fullWidth=false] - 전체 너비 사용
 * @param {'button'|'submit'|'reset'} [props.type='button'] - 버튼 타입
 * @param {Function} [props.onClick] - 클릭 핸들러
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.ReactNode} props.children - 버튼 텍스트/내용
 */

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconRight,
  fullWidth = false,
  type = 'button',
  onClick,
  className = '',
  children,
  ...restProps
}) {
  /**
   * Variant별 스타일 정의
   */
  const variantStyles = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
    outline: 'bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300'
  }

  /**
   * Size별 스타일 정의
   */
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  /**
   * 기본 스타일
   */
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    rounded-lg font-medium
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `

  /**
   * 최종 클래스명 조합
   */
  const buttonClasses = `
    ${baseStyles}
    ${variantStyles[variant] || variantStyles.primary}
    ${sizeStyles[size] || sizeStyles.md}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  /**
   * 로딩 스피너 컴포넌트
   */
  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      {...restProps}
    >
      {/* 로딩 중일 때 스피너 표시 */}
      {loading && <LoadingSpinner />}
      
      {/* 왼쪽 아이콘 */}
      {!loading && icon && <span className="flex-shrink-0">{icon}</span>}
      
      {/* 버튼 텍스트 */}
      {children}
      
      {/* 오른쪽 아이콘 */}
      {!loading && iconRight && <span className="flex-shrink-0">{iconRight}</span>}
    </button>
  )
}
