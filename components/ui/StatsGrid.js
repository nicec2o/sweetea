import StatCard from './StatCard';

export default function StatsGrid({ stats = [], columns = 4, className = '' }) {
  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div className={`grid grid-cols-1 ${gridColsClass} gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <StatCard
          key={stat.id || index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          iconBg={stat.iconBg}
          trend={stat.trend}
          trendValue={stat.trendValue}
          subtitle={stat.subtitle}
        />
      ))}
    </div>
  );
}
