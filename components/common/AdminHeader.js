/**
 * AdminHeader 컴포넌트
 * 
 * @description 관리자 페이지 전용 헤더
 * - 관리자 페이지 네비게이션
 * - 쇼핑몰로 돌아가기 링크
 * 
 * @param {Object} props
 * @param {string} props.currentPage - 현재 활성 페이지
 */

import Link from 'next/link'

export default function AdminHeader({ currentPage }) {
  /**
   * 네비게이션 메뉴 아이템 생성
   */
  const NavItem = ({ href, label, page }) => {
    const isActive = currentPage === page
    
    return (
      <Link 
        href={href}
        className={`px-4 py-2 rounded-lg transition ${
          isActive 
            ? 'bg-primary-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* 로고 */}
          <h1 className="text-2xl font-bold text-gray-800">
            SweeTea 관리자
          </h1>
          
          {/* 네비게이션 메뉴 */}
          <div className="flex gap-4">
            <NavItem href="/admin" label="대시보드" page="dashboard" />
            <NavItem href="/admin/products" label="상품관리" page="products" />
            <NavItem href="/admin/orders" label="주문관리" page="orders" />
            <NavItem href="/admin/ingredients" label="재료관리" page="ingredients" />
            <NavItem href="/admin/codes" label="공통코드" page="codes" />
            
            {/* 쇼핑몰로 돌아가기 */}
            <Link 
              href="/" 
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
            >
              쇼핑몰 🛍️
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
