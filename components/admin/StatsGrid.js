/**
 * StatsGrid 컴포넌트
 * 
 * @description 통계 카드 그리드 레이아웃
 */

export default function StatsGrid({ children, columns = 4 }) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6 mb-6`}>
      {children}
    </div>
  )
}
