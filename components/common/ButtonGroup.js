/**
 * ButtonGroup 컴포넌트
 * 
 * @description 버튼들을 그룹으로 묶어주는 컴포넌트
 * - 버튼 사이 간격 자동 조정
 * - 정렬 옵션 제공
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button 컴포넌트들
 * @param {'left'|'center'|'right'|'between'} [props.align='left'] - 정렬 방식
 * @param {'sm'|'md'|'lg'} [props.spacing='md'] - 버튼 간 간격
 * @param {string} [props.className] - 추가 CSS 클래스
 */

export default function ButtonGroup({
  children,
  align = 'left',
  spacing = 'md',
  className = ''
}) {
  /**
   * 정렬 스타일 정의
   */
  const alignStyles = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between'
  }

  /**
   * 간격 스타일 정의
   */
  const spacingStyles = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4'
  }

  /**
   * 최종 클래스명 조합
   */
  const groupClasses = `
    flex flex-wrap items-center
    ${alignStyles[align] || alignStyles.left}
    ${spacingStyles[spacing] || spacingStyles.md}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <div className={groupClasses}>
      {children}
    </div>
  )
}
