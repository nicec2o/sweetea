/**
 * ProductCard 컴포넌트
 * 
 * @description 개별 상품 카드
 * - 상품 이미지 (이모지 폴백)
 * - 상품명, 설명, 가격
 * - 장바구니 추가 버튼
 * 
 * @param {Object} props
 * @param {Object} props.product - 상품 정보 객체
 * @param {string} props.locale - 현재 언어
 * @param {Function} props.onAddToCart - 장바구니 추가 핸들러
 */

export default function ProductCard({ product, locale, onAddToCart }) {
  /**
   * 언어에 따라 상품명 반환
   * @returns {string} 현재 언어의 상품명
   */
  const getProductName = () => {
    if (locale === 'en') return product.name_en || product.name
    if (locale === 'ja') return product.name_ja || product.name
    return product.name
  }

  /**
   * 언어에 따라 상품 설명 반환
   * @returns {string} 현재 언어의 상품 설명
   */
  const getProductDescription = () => {
    if (locale === 'en') return product.description_en || product.description
    if (locale === 'ja') return product.description_ja || product.description
    return product.description
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      {/* 상품 이미지 영역 */}
      <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-6xl">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={getProductName()} 
            className="w-full h-full object-cover"
          />
        ) : (
          // 이미지가 없을 경우 이모지 표시
          <span>🧋</span>
        )}
      </div>
      
      {/* 상품 정보 영역 */}
      <div className="p-6">
        {/* 상품명 */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
          {getProductName()}
        </h3>
        
        {/* 상품 설명 (최대 2줄) */}
        <p className="text-gray-600 mb-4 line-clamp-2 min-h-[3rem]">
          {getProductDescription()}
        </p>
        
        {/* 가격 및 버튼 영역 */}
        <div className="flex justify-between items-center">
          {/* 가격 */}
          <span className="text-2xl font-bold text-primary-600">
            ₩{product.price.toLocaleString()}
          </span>
          
          {/* 장바구니 버튼 */}
          <button 
            onClick={() => onAddToCart(product)}
            className="px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition transform hover:scale-105"
          >
            🛒
          </button>
        </div>
        
        {/* 재고 정보 */}
        <div className="mt-3 text-sm">
          <span className={`font-medium ${
            product.stock > 10 
              ? 'text-green-600' 
              : product.stock > 0 
                ? 'text-orange-600' 
                : 'text-red-600'
          }`}>
            재고: {product.stock}개
          </span>
        </div>
      </div>
    </div>
  )
}
