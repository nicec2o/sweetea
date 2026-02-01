/**
 * OrderItemForm 컴포넌트
 * 
 * @description 주문에 상품 추가하는 폼
 * - 상품 선택, 수량 입력
 * 
 * @param {Object} props
 * @param {Array} props.products - 상품 목록
 * @param {Object} props.tempItem - 임시 항목 {product_id, quantity}
 * @param {Function} props.onTempItemChange - 임시 항목 변경 핸들러
 * @param {Function} props.onAddItem - 항목 추가 핸들러
 */

import FormSelect from '../form/FormSelect'
import NumberInput from '../form/NumberInput'
import Button from '../common/Button'

export default function OrderItemForm({
  products = [],
  tempItem = { product_id: '', quantity: 1 },
  onTempItemChange,
  onAddItem,
  className = ''
}) {
  const productOptions = products.map(p => ({
    value: p.id,
    label: `${p.name} (${p.category}) - ₩${p.price.toLocaleString()}`
  }))

  return (
    <div className={`p-4 bg-gray-50 rounded-lg ${className}`}>
      <h3 className="font-semibold mb-4">상품 추가</h3>

      <div className="flex gap-4">
        {/* 상품 선택 */}
        <div className="flex-1">
          <FormSelect
            name="product_id"
            value={tempItem.product_id}
            onChange={(value) => onTempItemChange({ ...tempItem, product_id: value })}
            options={productOptions}
            placeholder="상품을 선택하세요"
          />
        </div>

        {/* 수량 입력 */}
        <div className="w-24">
          <NumberInput
            name="quantity"
            value={tempItem.quantity}
            onChange={(value) => onTempItemChange({ ...tempItem, quantity: value })}
            min={1}
          />
        </div>

        {/* 추가 버튼 */}
        <div className="flex items-center">
          <Button
            variant="success"
            onClick={onAddItem}
          >
            추가
          </Button>
        </div>
      </div>
    </div>
  )
}
