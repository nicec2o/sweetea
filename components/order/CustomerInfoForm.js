/**
 * CustomerInfoForm 컴포넌트
 * 
 * @description 고객 정보 검색 및 입력 폼
 * - 기존 고객 자동 완성
 * - 신규 고객 정보 입력
 * 
 * @param {Object} props
 * @param {string} props.customerName - 고객명
 * @param {Function} props.onCustomerNameChange - 고객명 변경 핸들러
 * @param {Function} props.onCustomerNameBlur - 고객명 blur 핸들러
 * @param {Object} props.customerInfo - 기존 고객 정보
 * @param {boolean} props.isNewCustomer - 신규 고객 여부
 * @param {Object} props.formData - 폼 데이터
 * @param {Function} props.onFormDataChange - 폼 데이터 변경 핸들러
 */

import FormInput from '../form/FormInput'

export default function CustomerInfoForm({
  customerName,
  onCustomerNameChange,
  onCustomerNameBlur,
  customerInfo,
  isNewCustomer,
  formData,
  onFormDataChange,
  className = ''
}) {
  return (
    <div className={`p-4 bg-gray-50 rounded-lg ${className}`}>
      <h3 className="font-semibold mb-4">고객 정보</h3>

      {/* 고객명 입력 */}
      <FormInput
        label="고객명"
        name="customer_name"
        value={customerName}
        onChange={onCustomerNameChange}
        onBlur={onCustomerNameBlur}
        placeholder="고객 이름을 입력하세요"
        required
      />

      {/* 기존 고객 정보 표시 */}
      {customerInfo && !isNewCustomer && (
        <div className="mb-4 p-3 bg-green-50 border border-green-300 rounded">
          <p className="text-sm font-semibold text-green-800">✅ 기존 고객 정보</p>
          <p className="text-sm text-gray-700">전화번호: {customerInfo.phone || '없음'}</p>
          <p className="text-sm text-gray-700">주소: {customerInfo.address || '없음'}</p>
        </div>
      )}

      {/* 신규 고객 안내 */}
      {isNewCustomer && customerName && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded">
          <p className="text-sm font-semibold text-yellow-800">🆕 신규 고객</p>
          <p className="text-sm text-gray-700">주문 완료 시 자동으로 고객 정보가 생성됩니다</p>
        </div>
      )}

      {/* 전화번호 */}
      <FormInput
        label="전화번호"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={(value) => onFormDataChange({ ...formData, phone: value })}
        placeholder="010-XXXX-XXXX"
        required
      />

      {/* 주소 */}
      <FormInput
        label="주소"
        name="shipping_address"
        value={formData.shipping_address}
        onChange={(value) => onFormDataChange({ ...formData, shipping_address: value })}
        placeholder="시, 구, 동"
      />

      {/* 상세주소 */}
      <FormInput
        label="상세주소"
        name="shipping_address_detail"
        value={formData.shipping_address_detail}
        onChange={(value) => onFormDataChange({ ...formData, shipping_address_detail: value })}
        placeholder="건물명, 동/호수"
      />
    </div>
  )
}
