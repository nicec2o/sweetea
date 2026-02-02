/**
 * StockAlert 컴포넌트
 * 
 * @description 재고 부족 알림 배지
 */

export default function StockAlert({ count }) {
  if (count <= 0) return null

  return (
    <p className="text-red-600 mt-2 flex items-center gap-2">
      <span className="text-xl">⚠️</span>
      <span className="font-semibold">재고 부족 재료: {count}개</span>
    </p>
  )
}
