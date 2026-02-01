/**
 * FormModal 컴포넌트
 * 
 * @description 폼 전용 모달 (Modal 기반)
 * - 취소/저장 버튼 자동 생성
 * - 폼 제출 핸들링
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - 모달 열림 상태
 * @param {Function} props.onClose - 닫기 핸들러
 * @param {Function} props.onSubmit - 제출 핸들러
 * @param {string} props.title - 모달 제목
 * @param {string} props.submitText - 제출 버튼 텍스트
 * @param {string} props.cancelText - 취소 버튼 텍스트
 * @param {boolean} props.isSubmitting - 제출 중 상태
 * @param {ReactNode} props.children - 폼 필드들
 */

import Modal from './Modal'

export default function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  submitText = '저장',
  cancelText = '취소',
  isSubmitting = false,
  size = '2xl',
  children,
  className = ''
}) {
  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(e)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      className={className}
      showCloseButton={!isSubmitting}
    >
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          {children}
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {cancelText}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? '처리 중...' : submitText}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}
