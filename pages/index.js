/**
 * 메인 쇼핑몰 페이지
 * 
 * @description SweeTea 밀크티 쇼핑몰 메인 페이지
 * - 다국어 지원 (한국어, 영어, 일본어)
 * - 카테고리별 상품 필터링
 * - 반응형 디자인
 */

import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

// 컴포넌트 임포트
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import LoadingSpinner from '../components/common/LoadingSpinner'
import HeroSection from '../components/shop/HeroSection'
import CategoryFilter from '../components/shop/CategoryFilter'
import ProductGrid from '../components/shop/ProductGrid'

export default function Home() {
  // 라우터 및 언어 설정
  const router = useRouter()
  const { locale } = router

  // 상태 관리
  const [products, setProducts] = useState([]) // 상품 목록
  const [loading, setLoading] = useState(true) // 로딩 상태
  const [selectedCategory, setSelectedCategory] = useState('ALL') // 선택된 카테고리

  /**
   * 다국어 텍스트 정의
   */
  const translations = {
    ko: {
      title: 'SweeTea - 프리미엄 밀크티 전문점',
      subtitle: '최고급 재료로 만든 건강하고 맛있는 밀크티',
      shop: '쇼핑하기',
      admin: '관리자',
      categories: '카테고리',
      all: '전체',
      milkTea: '밀크티',
      fruitTea: '과일티',
      coffee: '커피',
      smoothie: '스무디',
      ade: '에이드',
      products: '상품',
      addToCart: '장바구니',
    },
    en: {
      title: 'SweeTea - Premium Milk Tea Shop',
      subtitle: 'Healthy and delicious milk tea made with premium ingredients',
      shop: 'Shop Now',
      admin: 'Admin',
      categories: 'Categories',
      all: 'All',
      milkTea: 'Milk Tea',
      fruitTea: 'Fruit Tea',
      coffee: 'Coffee',
      smoothie: 'Smoothie',
      ade: 'Ade',
      products: 'Products',
      addToCart: 'Add to Cart',
    },
    ja: {
      title: 'SweeTea - プレミアムミルクティー専門店',
      subtitle: '最高級の材料で作った健康的で美味しいミルクティー',
      shop: 'ショッピング',
      admin: '管理者',
      categories: 'カテゴリー',
      all: '全体',
      milkTea: 'ミルクティー',
      fruitTea: 'フルーツティー',
      coffee: 'コーヒー',
      smoothie: 'スムージー',
      ade: 'エード',
      products: '商品',
      addToCart: 'カート',
    }
  }

  // 현재 언어의 텍스트 가져오기
  const text = translations[locale] || translations.ko

  /**
   * 카테고리 목록 정의
   */
  const categories = [
    { code: 'ALL', name: text.all },
    { code: 'MILK_TEA', name: text.milkTea },
    { code: 'FRUIT_TEA', name: text.fruitTea },
    { code: 'COFFEE', name: text.coffee },
    { code: 'SMOOTHIE', name: text.smoothie },
    { code: 'ADE', name: text.ade },
  ]

  /**
   * 컴포넌트 마운트 시 및 카테고리 변경 시 상품 조회
   */
  useEffect(() => {
    fetchProducts()
  }, [selectedCategory])

  /**
   * API에서 상품 목록 조회
   */
  const fetchProducts = async () => {
    try {
      setLoading(true)
      
      // 카테고리에 따른 URL 생성
      const url = selectedCategory === 'ALL' 
        ? 'http://localhost:3001/api/products'
        : `http://localhost:3001/api/products?category=${selectedCategory}`
      
      const response = await fetch(url)
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      alert('상품을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  /**
   * 언어 변경 핸들러
   * @param {string} newLocale - 새로운 언어 코드
   */
  const handleLocaleChange = (newLocale) => {
    router.push(router.pathname, router.asPath, { locale: newLocale })
  }

  /**
   * 카테고리 변경 핸들러
   * @param {string} category - 선택된 카테고리 코드
   */
  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
  }

  /**
   * 장바구니 추가 핸들러
   * @param {Object} product - 추가할 상품 객체
   */
  const handleAddToCart = (product) => {
    // 장바구니 기능 구현 (추후 개발)
    alert(`${product.name}이(가) 장바구니에 추가되었습니다!`)
  }

  return (
    <>
      {/* 페이지 메타데이터 */}
      <Head>
        <title>{text.title}</title>
        <meta name="description" content={text.subtitle} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* 메인 컨테이너 */}
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
        {/* 헤더 */}
        <Header 
          locale={locale}
          onLocaleChange={handleLocaleChange}
          text={text}
        />

        {/* 히어로 섹션 */}
        <HeroSection text={text} />

        {/* 카테고리 필터 */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* 상품 목록 */}
        {loading ? (
          <LoadingSpinner size="lg" text="상품을 불러오는 중..." />
        ) : (
          <ProductGrid
            products={products}
            locale={locale}
            text={text}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* 푸터 */}
        <Footer />
      </div>
    </>
  )
}
