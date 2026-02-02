/**
 * OCRUploader 컴포넌트
 * 
 * @description OCR 이미지 업로드 및 텍스트 추출
 */

export default function OCRUploader({
  onImageUpload,
  isProcessing = false,
  extractedText = '',
  onTextChange
}) {
  return (
    <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-dashed border-blue-300">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-blue-800">📸 고객 정보 이미지 인식 (OCR)</h3>
          <p className="text-sm text-blue-600">명함, 메모, 스크린샷에서 고객 정보를 자동으로 추출합니다</p>
        </div>
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            disabled={isProcessing}
            className="hidden"
          />
          <span className={`
            px-4 py-2 rounded-lg inline-block
            ${isProcessing 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
            } 
            text-white transition
          `}>
            {isProcessing ? '처리중...' : '이미지 선택'}
          </span>
        </label>
      </div>
      
      {extractedText && (
        <div className="mt-4">
          <label className="block text-sm font-semibold text-blue-800 mb-2">
            추출된 텍스트 (수정 가능):
          </label>
          <textarea
            value={extractedText}
            onChange={(e) => onTextChange(e.target.value)}
            className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            rows="6"
            placeholder="추출된 텍스트가 여기에 표시됩니다."
          />
        </div>
      )}
    </div>
  )
}
