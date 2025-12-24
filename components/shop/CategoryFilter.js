/**
 * CategoryFilter 컴포넌트
 * 
 * @description 상품 카테고리 필터 버튼 그룹
 * - 카테고리별 필터링
 * - 활성 카테고리 표시
 * 
 * @param {Object} props
 * @param {Array} props.categories - 카테고리 목록 [{code, name}, ...]
 * @param {string} props.selectedCategory - 현재 선택된 카테고리
 * @param {Function} props.onCategoryChange - 카테고리 변경 핸들러
 */

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  return (
    <section className="container mx-auto px-4 py-8">
      {/* 섹션 타이틀 */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        카테고리
      </h2>
      
      {/* 카테고리 버튼 그룹 */}
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.code
          
          return (
            <button
              key={category.code}
              onClick={() => onCategoryChange(category.code)}
              className={`px-6 py-3 rounded-full font-semibold transition transform hover:scale-105 ${
                isSelected
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
              }`}
            >
              {category.name}
            </button>
          )
        })}
      </div>
    </section>
  )
}
