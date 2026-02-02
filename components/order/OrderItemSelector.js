/**
 * OrderItemSelector 컴포넌트
 * 
 * @description 주문 상품 선택 및 추가
 */

import Button from '../common/Button'

export default function OrderItemSelector({
  products = [],
  selectedProductId,
  quantity,
  onProductChange,
  onQuantityChange,
  onAddItem
}) {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-semibold mb-4">상품 추가</h3>
      <div className="flex gap-4">
        {/* 상품 선택 */}
        <select
          value={selectedProductId}
          onChange={(e) => onProductChange(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">상품을 선택하세요</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>
              {product.name} ({product.category}) - ₩{product.price.toLocaleString()}
            </option>
          ))}
        </select>

        {/* 수량 입력 */}
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => onQuantityChange(e.target.value)}
          className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        {/* 추가 버튼 */}
        <Button
          variant="success"
          onClick={onAddItem}
        >
          추가
        </Button>
      </div>
    </div>
  )
}
