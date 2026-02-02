/**
 * AdminLayout 컴포넌트
 * 
 * @description 관리자 페이지 공통 레이아웃
 * - AdminHeader 포함
 * - 컨테이너 및 배경색 기본 설정
 * 
 * @param {Object} props
 * @param {string} props.title - 페이지 타이틀
 * @param {ReactNode} props.children - 페이지 내용
 */

import Head from 'next/head'
import AdminHeader from './AdminHeader'

export default function AdminLayout({
  title = 'SweeTea Admin',
  children,
  className = ''
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <div className={`min-h-screen bg-gray-100 ${className}`}>
        {/* 관리자 헤더 */}
        <AdminHeader />

        {/* 메인 컨텐츠 */}
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </>
  )
}
