/**
 * Modal 컴포넌트
 * 
 * @description 재사용 가능한 모달 래퍼
 */

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-2xl'
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg p-8 ${maxWidth} w-full max-h-[90vh] overflow-y-auto`}>
        {/* 헤더 */}
        {title && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>
        )}

        {/* 내용 */}
        {children}
      </div>
    </div>
  )
}
