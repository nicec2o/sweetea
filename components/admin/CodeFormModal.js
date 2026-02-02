/**
 * 공통코드 추가/수정 모달 컴포넌트
 */

import { useState, useEffect } from 'react'

export default function CodeFormModal({ 
  isOpen, 
  onClose, 
  editingCode, 
  onSubmit 
}) {
  const [formData, setFormData] = useState({
    code_group: '',
    code: '',
    code_name: '',
    code_name_en: '',
    code_name_ja: '',
    sort_order: 0,
    use_yn: 'Y'
  })

  useEffect(() => {
    if (editingCode) {
      setFormData({
        code_group: editingCode.code_group,
        code: editingCode.code,
        code_name: editingCode.code_name,
        code_name_en: editingCode.code_name_en || '',
        code_name_ja: editingCode.code_name_ja || '',
        sort_order: editingCode.sort_order,
        use_yn: editingCode.use_yn
      })
    } else {
      setFormData({
        code_group: '',
        code: '',
        code_name: '',
        code_name_en: '',
        code_name_ja: '',
        sort_order: 0,
        use_yn: 'Y'
      })
    }
  }, [editingCode, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {editingCode ? '공통코드 수정' : '공통코드 추가'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 코드그룹 & 코드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  코드그룹
                </label>
                <input
                  type="text"
                  required
                  value={formData.code_group}
                  onChange={(e) => handleChange('code_group', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="예: CATEGORY, ORDER_STATUS"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  코드
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => handleChange('code', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="예: MILK_TEA, pending"
                />
              </div>
            </div>

            {/* 다국어 코드명 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  코드명 (한국어)
                </label>
                <input
                  type="text"
                  required
                  value={formData.code_name}
                  onChange={(e) => handleChange('code_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  코드명 (English)
                </label>
                <input
                  type="text"
                  value={formData.code_name_en}
                  onChange={(e) => handleChange('code_name_en', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  코드명 (日本語)
                </label>
                <input
                  type="text"
                  value={formData.code_name_ja}
                  onChange={(e) => handleChange('code_name_ja', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* 정렬순서 & 사용여부 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  정렬순서
                </label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => handleChange('sort_order', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사용여부
                </label>
                <select
                  value={formData.use_yn}
                  onChange={(e) => handleChange('use_yn', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Y">사용</option>
                  <option value="N">미사용</option>
                </select>
              </div>
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
                {editingCode ? '수정' : '등록'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
