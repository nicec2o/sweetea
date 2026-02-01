/**
 * Container 컴포넌트
 * 
 * @description 반응형 컨테이너
 * - 최대 너비 및 패딩 설정
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - 컨텐츠
 * @param {string} props.maxWidth - 최대 너비 (sm, md, lg, xl, 2xl, full)
 */

export default function Container({
  children,
  maxWidth = 'xl',
  className = ''
}) {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full'
  }

  return (
    <div className={`
      container mx-auto px-4
      ${maxWidthClasses[maxWidth] || maxWidthClasses.xl}
      ${className}
    `}>
      {children}
    </div>
  )
}
