/**
 * Modal 컴포넌트
 * 
 * @description 재사용 가능한 모달 래퍼
 * - 오버레이, 닫기 버튼, 헤더/푸터 슬롯
 * - 다양한 크기 지원
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - 모달 열림 상태
 * @param {Function} props.onClose - 닫기 핸들러
 * @param {string} props.title - 모달 제목
 * @param {string} props.size - 크기 (sm, md, lg, xl, 2xl, full)
 * @param {string} props.maxHeight - 최대 높이
 * @param {ReactNode} props.children - 모달 내용
 * @param {boolean} props.showCloseButton - 닫기 버튼 표시 여부
 */

export default function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  maxHeight = '90vh',
  children,
  showCloseButton = true,
  className = ''
}) {
  if (!isOpen) return null

  // 크기별 클래스
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-full mx-4'
  }

  // ESC 키로 닫기
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  // 오버레이 클릭 시 닫기
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`
          bg-white rounded-lg shadow-xl w-full
          ${sizeClasses[size] || sizeClasses.md}
          ${className}
        `}
        style={{ maxHeight }}
      >
        {/* 헤더 */}
        {(title || showCloseButton) && (
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            {title && (
              <h2 className="text-2xl font-bold text-gray-800">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition text-2xl leading-none"
                aria-label="Close modal"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* 내용 */}
        <div className="overflow-y-auto" style={{ maxHeight: `calc(${maxHeight} - 140px)` }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// 서브 컴포넌트들
Modal.Body = function ModalBody({ children, className = '' }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  )
}

Modal.Footer = function ModalFooter({ children, className = '' }) {
  return (
    <div className={`flex justify-end gap-3 p-6 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  )
}
