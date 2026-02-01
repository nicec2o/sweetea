/**
 * StatsGrid 컴포넌트
 * 
 * @description StatCard들을 그리드로 배치하는 컴포넌트
 * - 반응형 그리드
 * - 통일된 간격
 * 
 * @param {Object} props
 * @param {Array} props.stats - 통계 데이터 배열 [{title, value, icon, bgColor}]
 */

import StatCard from '../admin/StatCard'

export default function StatsGrid({
  stats = [],
  columns = 4,
  className = ''
}) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4'
  }

  return (
    <div className={`
      grid grid-cols-1 ${gridCols[columns] || 'lg:grid-cols-4'} gap-6
      ${className}
    `}>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          bgColor={stat.bgColor}
        />
      ))}
    </div>
  )
}
