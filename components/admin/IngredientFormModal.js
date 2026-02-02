/**
 * IngredientFormModal 컴포넌트
 * 
 * @description 재료 추가/수정 모달
 */

import { useState } from 'react'
import FormInput from '../form/FormInput'
import NumberInput from '../form/NumberInput'
import MultiLangInput from '../form/MultiLangInput'

export default function IngredientFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null 
}) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    name_en: '',
    name_ja: '',
    name_vi: '',
    unit: '',
    stock: 0,
    min_stock: 0,
    price_per_unit: 0,
    supplier: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleMultiLangChange = (field, lang, value) => {
    const fieldMap = {
      ko: field,
      en: `${field}_en`,
      ja: `${field}_ja`,
      vi: `${field}_vi`
    }
    setFormData(prev => ({
      ...prev,
      [fieldMap[lang]]: value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">
          {initialData ? '재료 수정' : '재료 추가'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {/* 재료명 (한국어) */}
            <div className="col-span-2">
              <FormInput
                label="재료명 (한국어)"
                name="name"
                value={formData.name}
                onChange={(value) => setFormData({...formData, name: value})}
                required
              />
            </div>

            {/* 재료명 (영어) */}
            <FormInput
              label="Name (English)"
              name="name_en"
              value={formData.name_en}
              onChange={(value) => setFormData({...formData, name_en: value})}
            />

            {/* 재료명 (일본어) */}
            <FormInput
              label="名前 (日本語)"
              name="name_ja"
              value={formData.name_ja}
              onChange={(value) => setFormData({...formData, name_ja: value})}
            />

            {/* 재료명 (베트남어) */}
            <div className="col-span-2">
              <FormInput
                label="Tên (Tiếng Việt)"
                name="name_vi"
                value={formData.name_vi}
                onChange={(value) => setFormData({...formData, name_vi: value})}
              />
            </div>

            {/* 단위 */}
            <FormInput
              label="단위"
              name="unit"
              value={formData.unit}
              onChange={(value) => setFormData({...formData, unit: value})}
              placeholder="g, ml, 개 등"
              required
            />

            {/* 재고 */}
            <NumberInput
              label="현재 재고"
              name="stock"
              value={formData.stock}
              onChange={(value) => setFormData({...formData, stock: value})}
              required
              min={0}
            />

            {/* 최소 재고 */}
            <NumberInput
              label="최소 재고"
              name="min_stock"
              value={formData.min_stock}
              onChange={(value) => setFormData({...formData, min_stock: value})}
              required
              min={0}
            />

            {/* 단가 */}
            <NumberInput
              label="단가 (원)"
              name="price_per_unit"
              value={formData.price_per_unit}
              onChange={(value) => setFormData({...formData, price_per_unit: value})}
              min={0}
            />

            {/* 공급처 */}
            <div className="col-span-2">
              <FormInput
                label="공급처"
                name="supplier"
                value={formData.supplier}
                onChange={(value) => setFormData({...formData, supplier: value})}
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              {initialData ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
