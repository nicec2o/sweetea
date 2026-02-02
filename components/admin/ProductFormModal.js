/**
 * ProductFormModal 컴포넌트
 * 
 * @description 상품 추가/수정 모달
 */

import { useState } from 'react'
import FormInput from '../form/FormInput'
import FormTextarea from '../form/FormTextarea'
import FormSelect from '../form/FormSelect'
import NumberInput from '../form/NumberInput'
import MultiLangInput from '../form/MultiLangInput'

export default function ProductFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null 
}) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    name_en: '',
    name_ja: '',
    description: '',
    description_en: '',
    description_ja: '',
    price: '',
    category: 'MILK_TEA',
    image_url: '',
    stock: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleMultiLangChange = (field, lang, value) => {
    const fieldMap = {
      ko: field,
      en: `${field}_en`,
      ja: `${field}_ja`
    }
    setFormData(prev => ({
      ...prev,
      [fieldMap[lang]]: value
    }))
  }

  const categoryOptions = [
    { value: 'MILK_TEA', label: '밀크티' },
    { value: 'FRUIT_TEA', label: '과일티' },
    { value: 'COFFEE', label: '커피' },
    { value: 'SMOOTHIE', label: '스무디' },
    { value: 'ADE', label: '에이드' }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {initialData ? '상품 수정' : '상품 추가'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 상품명 (다국어) */}
            <MultiLangInput
              label="상품명"
              value={{
                ko: formData.name,
                en: formData.name_en,
                ja: formData.name_ja
              }}
              onChange={handleMultiLangChange.bind(null, 'name')}
              required
            />

            {/* 설명 (다국어) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설명
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormTextarea
                  name="description"
                  value={formData.description}
                  onChange={(value) => setFormData({...formData, description: value})}
                  placeholder="한국어"
                  rows={3}
                />
                <FormTextarea
                  name="description_en"
                  value={formData.description_en}
                  onChange={(value) => setFormData({...formData, description_en: value})}
                  placeholder="English"
                  rows={3}
                />
                <FormTextarea
                  name="description_ja"
                  value={formData.description_ja}
                  onChange={(value) => setFormData({...formData, description_ja: value})}
                  placeholder="日本語"
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 가격 */}
              <NumberInput
                label="가격"
                name="price"
                value={formData.price}
                onChange={(value) => setFormData({...formData, price: value})}
                required
                min={0}
              />

              {/* 카테고리 */}
              <FormSelect
                label="카테고리"
                name="category"
                value={formData.category}
                onChange={(value) => setFormData({...formData, category: value})}
                options={categoryOptions}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 이미지 URL */}
              <FormInput
                label="이미지 URL"
                name="image_url"
                type="url"
                value={formData.image_url}
                onChange={(value) => setFormData({...formData, image_url: value})}
                placeholder="https://example.com/image.jpg"
              />

              {/* 재고 */}
              <NumberInput
                label="재고"
                name="stock"
                value={formData.stock}
                onChange={(value) => setFormData({...formData, stock: value})}
                required
                min={0}
              />
            </div>

            {/* 버튼 */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                {initialData ? '수정' : '등록'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
