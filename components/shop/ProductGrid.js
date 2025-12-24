/**
 * ProductGrid 컴포넌트
 * 
 * @description 상품 목록 그리드
 * - 반응형 그리드 레이아웃
 * - 상품 카드 목록 표시
 * 
 * @param {Object} props
 * @param {Array} props.products - 상품 목록
 * @param {string} props.locale - 현재 언어
 * @param {Object} props.text - 번역 텍스트 객체
 * @param {Function} props.onAddToCart - 장바구니 추가 핸들러
 */

import ProductCard from './ProductCard'

export default function ProductGrid({ products, locale, text, onAddToCart }) {
  return (
    <section id="products" className="container mx-auto px-4 py-12">
      {/* 섹션 타이틀 */}
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        {text.products}
      </h2>
      
      {/* 상품이 없을 경우 */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">
            상품이 없습니다.
          </p>
        </div>
      ) : (
        /* 상품 그리드 */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </section>
  )
}
