/**
 * Footer 컴포넌트
 * 
 * @description 사이트 하단 푸터 컴포넌트
 * - 저작권 정보 표시
 * - 회사 정보 표시
 */

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        {/* 메인 정보 */}
        <div className="text-center mb-4">
          <p className="text-lg font-semibold mb-2">SweeTea © 2024</p>
          <p className="text-gray-400">Premium Milk Tea Shop</p>
        </div>
        
        {/* 연락처 정보 */}
        <div className="text-center text-sm text-gray-400 space-y-1">
          <p>📍 Seoul, South Korea</p>
          <p>📞 02-1234-5678</p>
          <p>📧 contact@sweetea.com</p>
        </div>
      </div>
    </footer>
  )
}
