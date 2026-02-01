/**
 * OrderItemsTable 컴포넌트
 * 
 * @description 주문 항목 목록 테이블
 * - 상품명, 단가, 수량, 소계
 * - 삭제 버튼
 * - 총 금액 계산
 * 
 * @param {Object} props
 * @param {Array} props.items - 주문 항목 배열
 * @param {Function} props.onRemoveItem - 항목 삭제 핸들러
 */

import IconButton from '../common/IconButton'

export default function OrderItemsTable({
  items = [],
  onRemoveItem,
  className = ''
}) {
  // 총 금액 계산
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className={className}>
      <h3 className="font-semibold mb-4">주문 항목</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">상품명</th>
              <th className="border p-2 text-right">단가</th>
              <th className="border p-2 text-center">수량</th>
              <th className="border p-2 text-right">소계</th>
              <th className="border p-2 text-center">삭제</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="border p-2">{item.product_name}</td>
                <td className="border p-2 text-right">
                  ₩{item.price.toLocaleString()}
                </td>
                <td className="border p-2 text-center">{item.quantity}</td>
                <td className="border p-2 text-right">
                  ₩{(item.price * item.quantity).toLocaleString()}
                </td>
                <td className="border p-2 text-center">
                  <IconButton
                    icon="✕"
                    variant="danger"
                    onClick={() => onRemoveItem(index)}
                    title="삭제"
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold">
              <td colSpan="3" className="border p-2 text-right">총 금액</td>
              <td className="border p-2 text-right">
                ₩{calculateTotal().toLocaleString()}
              </td>
              <td className="border p-2"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
