/**
 * HeroSection 컴포넌트
 * 
 * @description 메인 페이지 히어로 섹션
 * - 쇼핑몰 타이틀 및 설명
 * - CTA(Call To Action) 버튼
 * 
 * @param {Object} props
 * @param {Object} props.text - 번역 텍스트 객체
 */

import Link from 'next/link'

export default function HeroSection({ text }) {
  return (
    <section className="container mx-auto px-4 py-16 text-center">
      {/* 메인 타이틀 */}
      <h1 className="text-5xl font-bold text-gray-800 mb-4 animate-fade-in">
        {text.title}
      </h1>
      
      {/* 서브타이틀 */}
      <p className="text-xl text-gray-600 mb-8">
        {text.subtitle}
      </p>
      
      {/* CTA 버튼 */}
      <Link 
        href="#products" 
        className="inline-block px-8 py-4 bg-primary-500 text-white rounded-full text-lg font-semibold hover:bg-primary-600 transition transform hover:scale-105 shadow-lg hover:shadow-xl"
      >
        {text.shop}
      </Link>
    </section>
  )
}
