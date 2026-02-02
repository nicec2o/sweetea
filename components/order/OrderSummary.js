/**
 * OrderSummary 컴포넌트
 * 
 * @description 주문 총액 요약 표시
 */

export default function OrderSummary({ totalAmount }) {
  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-gray-800">총 금액</span>
        <span className="text-2xl font-bold text-primary-600">
          ₩{totalAmount.toLocaleString()}
        </span>
      </div>
    </div>
  )
}
