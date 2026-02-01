/**
 * OCRUploadBox 컴포넌트
 * 
 * @description OCR 이미지 업로드 영역
 * - 파일 선택
 * - 처리 중 로딩 표시
 * - 결과 텍스트 편집 가능
 * 
 * @param {Object} props
 * @param {Function} props.onImageUpload - 이미지 업로드 핸들러
 * @param {boolean} props.isProcessing - 처리 중 상태
 * @param {string} props.resultText - 추출된 텍스트
 * @param {Function} props.onTextChange - 텍스트 변경 핸들러
 */

import { useRef } from 'react'

export default function OCRUploadBox({
  onImageUpload,
  isProcessing = false,
  resultText = '',
  onTextChange,
  className = ''
}) {
  const fileInputRef = useRef()

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`p-4 bg-blue-50 rounded-lg border-2 border-dashed border-blue-300 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-blue-800">
            📸 고객 정보 이미지 인식 (OCR)
          </h3>
          <p className="text-sm text-blue-600">
            명함, 메모, 스크린샷에서 고객 정보를 자동으로 추출합니다
          </p>
        </div>
        <button
          type="button"
          onClick={handleFileSelect}
          disabled={isProcessing}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition"
        >
          {isProcessing ? '처리중...' : '이미지 선택'}
        </button>
      </div>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onImageUpload}
        className="hidden"
      />

      {/* OCR 결과 텍스트 편집 */}
      {resultText && (
        <div className="mt-4">
          <label className="block text-sm font-semibold text-blue-800 mb-2">
            추출된 텍스트 (수정 가능):
          </label>
          <textarea
            value={resultText}
            onChange={(e) => onTextChange && onTextChange(e.target.value)}
            className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            rows="6"
            placeholder="추출된 텍스트가 여기에 표시됩니다. 수정할 수 있습니다."
          />
        </div>
      )}

      {/* 로딩 인디케이터 */}
      {isProcessing && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-sm text-blue-600">이미지를 분석하는 중...</p>
        </div>
      )}
    </div>
  )
}
