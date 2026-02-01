/**
 * IconButton 컴포넌트
 * 
 * @description 아이콘만 있는 버튼 컴포넌트
 * - 정사각형 모양
 * - 다양한 variant 지원
 * - 툴팁 지원 (title 속성)
 * - 크기 조절 가능
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.icon - 표시할 아이콘
 * @param {'primary'|'secondary'|'danger'|'ghost'|'outline'|'success'} [props.variant='ghost'] - 버튼 스타일
 * @param {'sm'|'md'|'lg'} [props.size='md'] - 버튼 크기
 * @param {boolean} [props.disabled=false] - 비활성화 상태
 * @param {string} [props.title] - 툴팁 텍스트
 * @param {'button'|'submit'|'reset'} [props.type='button'] - 버튼 타입
 * @param {Function} [props.onClick] - 클릭 핸들러
 * @param {string} [props.className] - 추가 CSS 클래스
 */

export default function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  title,
  type = 'button',
  onClick,
  className = '',
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
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:ring-gray-300',
    outline: 'bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300'
  }

  /**
   * Size별 스타일 정의
   */
  const sizeStyles = {
    sm: 'p-1.5 text-sm',
    md: 'p-2 text-base',
    lg: 'p-3 text-lg'
  }

  /**
   * 기본 스타일
   */
  const baseStyles = `
    inline-flex items-center justify-center
    rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  /**
   * 최종 클래스명 조합
   */
  const buttonClasses = `
    ${baseStyles}
    ${variantStyles[variant] || variantStyles.ghost}
    ${sizeStyles[size] || sizeStyles.md}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={buttonClasses}
      {...restProps}
    >
      {icon}
    </button>
  )
}
