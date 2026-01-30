/**
 * Header 컴포넌트
 * 
 * @description 사이트 상단 헤더 컴포넌트
 * - 로고 표시
 * - 언어 선택 드롭다운
 * - 관리자 페이지 링크
 * 
 * @param {Object} props
 * @param {string} props.locale - 현재 선택된 언어 (ko, en, ja, vi)
 * @param {Function} props.onLocaleChange - 언어 변경 핸들러
 * @param {Object} props.text - 번역 텍스트 객체
 */

import Link from 'next/link'

export default function Header({ locale, onLocaleChange, text }) {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* 로고 */}
          <Link href="/" className="text-3xl font-bold text-primary-600 hover:text-primary-700 transition">
            SweeTea 🧋
          </Link>
          
          {/* 네비게이션 */}
          <div className="flex gap-4 items-center">
            {/* 언어 선택 드롭다운 */}
            <select 
              value={locale}
              onChange={(e) => onLocaleChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
            >
              <option value="ko">한국어 🇰🇷</option>
              <option value="en">English 🇺🇸</option>
              <option value="ja">日本語 🇯🇵</option>
              <option value="vi">Tiếng Việt 🇻🇳</option>
            </select>
            
            {/* 관리자 페이지 링크 */}
            <Link 
              href="/admin" 
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition transform hover:scale-105"
            >
              {text.admin}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
