/**
 * CustomerInfoForm 컴포넌트
 * 
 * @description 고객 정보 입력 폼
 */

import FormInput from '../form/FormInput'
import CustomerInfoBadge from './CustomerInfoBadge'

export default function CustomerInfoForm({
  customerName,
  onCustomerNameChange,
  onCustomerNameBlur,
  customerInfo,
  isNewCustomer,
  formData,
  onFormDataChange
}) {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
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
        className="mb-4"
      />

      {/* 기존/신규 고객 배지 */}
      <CustomerInfoBadge
        customerInfo={customerInfo}
        isNewCustomer={isNewCustomer}
        customerName={customerName}
      />

      {/* 전화번호 */}
      <FormInput
        label="전화번호"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={(value) => onFormDataChange({ ...formData, phone: value })}
        placeholder="010-XXXX-XXXX"
        required
        className="mb-4"
      />

      {/* 주소 */}
      <FormInput
        label="주소"
        name="shipping_address"
        value={formData.shipping_address}
        onChange={(value) => onFormDataChange({ ...formData, shipping_address: value })}
        placeholder="시, 구, 동"
        className="mb-4"
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
