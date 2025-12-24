/**
 * ProductModal 컴포넌트
 * 
 * @description 상품 추가/수정 모달
 * - 다국어 입력 폼
 * - 유효성 검증
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - 모달 표시 여부
 * @param {Function} props.onClose - 모달 닫기 핸들러
 * @param {Function} props.onSubmit - 폼 제출 핸들러
 * @param {Object} props.formData - 폼 데이터
 * @param {Function} props.setFormData - 폼 데이터 업데이트 함수
 * @param {boolean} props.isEditing - 수정 모드 여부
 */

export default function ProductModal({ isOpen, onClose, onSubmit, formData, setFormData, isEditing }) {
  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null

  /**
   * 입력값 변경 핸들러
   * @param {string} field - 필드명
   * @param {string} value - 입력값
   */
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  /**
   * 폼 제출 핸들러
   * @param {Event} e - 폼 제출 이벤트
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(e)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* 모달 헤더 */}
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {isEditing ? '상품 수정' : '상품 추가'}
          </h3>
          
          {/* 상품 입력 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 상품명 (다국어) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상품명 (한국어) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="클래식 밀크티"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상품명 (English)
                </label>
                <input
                  type="text"
                  value={formData.name_en}
                  onChange={(e) => handleChange('name_en', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Classic Milk Tea"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상품명 (日本語)
                </label>
                <input
                  type="text"
                  value={formData.name_ja}
                  onChange={(e) => handleChange('name_ja', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="クラシックミルクティー"
                />
              </div>
            </div>

            {/* 상품 설명 (다국어) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설명 (한국어)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows="3"
                  placeholder="진한 홍차와 부드러운 우유의 조화"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설명 (English)
                </label>
                <textarea
                  value={formData.description_en}
                  onChange={(e) => handleChange('description_en', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows="3"
                  placeholder="Perfect blend of strong tea"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설명 (日本語)
                </label>
                <textarea
                  value={formData.description_ja}
                  onChange={(e) => handleChange('description_ja', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows="3"
                  placeholder="濃厚な紅茶とまろやかな牛乳"
                />
              </div>
            </div>

            {/* 가격 및 카테고리 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  가격 (₩) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="5000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리 <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="MILK_TEA">밀크티</option>
                  <option value="FRUIT_TEA">과일티</option>
                  <option value="COFFEE">커피</option>
                  <option value="SMOOTHIE">스무디</option>
                  <option value="ADE">에이드</option>
                </select>
              </div>
            </div>

            {/* 이미지 URL 및 재고 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이미지 URL
                </label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => handleChange('image_url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="/images/product.jpg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  재고 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleChange('stock', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="100"
                />
              </div>
            </div>

            {/* 버튼 그룹 */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
              >
                {isEditing ? '수정' : '등록'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
