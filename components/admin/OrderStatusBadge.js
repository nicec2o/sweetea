/**
 * OrderStatusBadge 컴포넌트
 * 
 * @description 주문 상태 배지
 * - 상태에 따라 색상 변경
 * 
 * @param {Object} props
 * @param {string} props.status - 주문 상태 (pending, confirmed, preparing, shipping, completed, cancelled)
 */

export default function OrderStatusBadge({ status }) {
  /**
   * 상태별 배지 스타일 매핑
   */
  const badgeStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-purple-100 text-purple-800',
    shipping: 'bg-indigo-100 text-indigo-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  /**
   * 상태별 텍스트 매핑
   */
  const statusTexts = {
    pending: '주문접수',
    confirmed: '주문확인',
    preparing: '준비중',
    shipping: '배송중',
    completed: '배송완료',
    cancelled: '취소',
  }

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badgeStyles[status] || badgeStyles.pending}`}>
      {statusTexts[status] || status}
    </span>
  )
}
