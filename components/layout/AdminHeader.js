import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AdminHeader() {
  const router = useRouter();
  
  const navItems = [
    { href: '/admin', label: '대시보드', icon: '📊' },
    { href: '/admin/products', label: '상품 관리', icon: '🧋' },
    { href: '/admin/ingredients', label: '재료 관리', icon: '📦' },
    { href: '/admin/orders', label: '주문 관리', icon: '📋' },
    { href: '/admin/codes', label: '코드 관리', icon: '⚙️' }
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return router.pathname === '/admin';
    }
    return router.pathname.startsWith(path);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/admin" className="text-2xl font-bold text-blue-600">
              SweeTea Admin
            </Link>
          </div>

          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              🏠 홈으로
            </Link>
            <button
              onClick={() => alert('로그아웃 기능은 추후 구현 예정')}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(item.href)
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
