/**
 * 어드민 공통 헤더 컴포넌트 - 백업본
 */

import Link from 'next/link'

export default function AdminHeader({ title, currentPage }) {
  const menuItems = [
    { label: '대시보드', href: '/admin', key: 'dashboard' },
    { label: '상품관리', href: '/admin/products', key: 'products' },
    { label: '주문관리', href: '/admin/orders', key: 'orders' },
    { label: '공통코드', href: '/admin/codes', key: 'codes' },
    { label: '쇼핑몰', href: '/', key: 'shop' }
  ]

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <nav className="flex gap-4">
            {menuItems.map((item) => {
              const isActive = currentPage === item.key
              const isShop = item.key === 'shop'
              
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isShop
                      ? 'bg-gray-800 text-white hover:bg-gray-700'
                      : isActive
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
