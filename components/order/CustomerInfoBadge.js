/**
 * CustomerInfoBadge 컴포넌트
 * 
 * @description 기존 고객 / 신규 고객 정보 배지
 */

export default function CustomerInfoBadge({ customerInfo, isNewCustomer, customerName }) {
  if (!customerName) return null

  if (customerInfo && !isNewCustomer) {
    return (
      <div className="mb-4 p-3 bg-green-50 border border-green-300 rounded">
        <p className="text-sm font-semibold text-green-800">✅ 기존 고객 정보</p>
        <p className="text-sm text-gray-700">전화번호: {customerInfo.phone || '없음'}</p>
        <p className="text-sm text-gray-700">주소: {customerInfo.address || '없음'}</p>
      </div>
    )
  }

  if (isNewCustomer) {
    return (
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded">
        <p className="text-sm font-semibold text-yellow-800">🆕 신규 고객</p>
        <p className="text-sm text-gray-700">주문 완료 시 자동으로 고객 정보가 생성됩니다</p>
      </div>
    )
  }

  return null
}
