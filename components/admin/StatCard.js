/**
 * StatCard 컴포넌트
 * 
 * @description 대시보드 통계 카드
 * - 아이콘과 숫자로 통계 표시
 * 
 * @param {Object} props
 * @param {string} props.title - 카드 제목
 * @param {string|number} props.value - 표시할 값
 * @param {string} props.icon - 표시할 이모지 아이콘
 * @param {string} props.bgColor - 배경색 (Tailwind 클래스)
 */

export default function StatCard({ title, value, icon, bgColor = 'bg-blue-100' }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        {/* 텍스트 영역 */}
        <div>
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        
        {/* 아이콘 영역 */}
        <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
