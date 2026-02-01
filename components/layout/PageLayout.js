/**
 * PageLayout 컴포넌트
 * 
 * @description 일반 페이지 공통 레이아웃
 * - Head, Header, Main, Footer 포함
 * - SEO 메타 태그 지원
 * 
 * @param {Object} props
 * @param {string} props.title - 페이지 타이틀
 * @param {string} props.description - 페이지 설명
 * @param {string} props.locale - 현재 언어
 * @param {Function} props.onLocaleChange - 언어 변경 핸들러
 * @param {Object} props.headerText - 헤더 텍스트 객체
 * @param {ReactNode} props.children - 페이지 내용
 */

import Head from 'next/head'
import Header from '../common/Header'
import Footer from '../common/Footer'

export default function PageLayout({
  title = 'SweeTea',
  description = 'Premium Milk Tea Shop',
  locale,
  onLocaleChange,
  headerText,
  children,
  className = ''
}) {
  return (
    <>
      {/* SEO */}
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* 전체 레이아웃 */}
      <div className={`min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 ${className}`}>
        {/* 헤더 */}
        {locale && onLocaleChange && headerText && (
          <Header
            locale={locale}
            onLocaleChange={onLocaleChange}
            text={headerText}
          />
        )}

        {/* 메인 컨텐츠 */}
        <main>
          {children}
        </main>

        {/* 푸터 */}
        <Footer />
      </div>
    </>
  )
}
