/**
 * IngredientForm 컴포넌트
 * 
 * @description 재료 추가/수정 폼
 */

import FormInput from '../form/FormInput'
import Button from '../common/Button'

export default function IngredientForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  isEditing = false
}) {
  const handleChange = (field, value) => {
    onChange({ ...formData, [field]: value })
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-6">
        {/* 재료명 다국어 */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">재료명</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="🇰🇷 한국어"
              name="name"
              value={formData.name}
              onChange={(value) => handleChange('name', value)}
              required
              className="md:col-span-2"
            />
            <FormInput
              label="🇺🇸 English"
              name="name_en"
              value={formData.name_en}
              onChange={(value) => handleChange('name_en', value)}
            />
            <FormInput
              label="🇯🇵 日本語"
              name="name_ja"
              value={formData.name_ja}
              onChange={(value) => handleChange('name_ja', value)}
            />
            <FormInput
              label="🇻🇳 Tiếng Việt"
              name="name_vi"
              value={formData.name_vi}
              onChange={(value) => handleChange('name_vi', value)}
              className="md:col-span-2"
            />
          </div>
        </div>

        {/* 재고 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="단위"
            name="unit"
            value={formData.unit}
            onChange={(value) => handleChange('unit', value)}
            placeholder="g, ml, 개 등"
            required
          />
          <FormInput
            label="현재 재고"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={(value) => handleChange('stock', value)}
            required
            min="0"
          />
          <FormInput
            label="최소 재고"
            name="min_stock"
            type="number"
            value={formData.min_stock}
            onChange={(value) => handleChange('min_stock', value)}
            required
            min="0"
          />
          <FormInput
            label="단가 (원)"
            name="price_per_unit"
            type="number"
            value={formData.price_per_unit}
            onChange={(value) => handleChange('price_per_unit', value)}
            min="0"
          />
        </div>

        {/* 공급처 */}
        <FormInput
          label="공급처"
          name="supplier"
          value={formData.supplier}
          onChange={(value) => handleChange('supplier', value)}
        />
      </div>

      {/* 버튼 */}
      <div className="flex gap-4 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          취소
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
        >
          {isEditing ? '수정' : '추가'}
        </Button>
      </div>
    </form>
  )
}
