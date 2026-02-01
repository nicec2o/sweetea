/**
 * MultiLangInput 컴포넌트
 * 
 * @description 다국어 입력 필드 그룹 컴포넌트
 * - 한국어, 영어, 일본어, 베트남어 입력 필드를 하나로 묶음
 * - 텍스트 입력 또는 텍스트 영역으로 사용 가능
 * 
 * @param {Object} props
 * @param {string} props.label - 라벨 텍스트
 * @param {string} props.name - 필드 이름 (예: 'name', 'description')
 * @param {Object} props.values - 다국어 값 객체 {ko, en, ja, vi}
 * @param {Function} props.onChange - 변경 핸들러 (lang, value) => {}
 * @param {boolean} props.required - 한국어 필드 필수 여부
 * @param {boolean} props.multiline - 텍스트 영역 사용 여부
 * @param {number} props.rows - 텍스트 영역 행 수
 */

export default function MultiLangInput({
  label,
  name,
  values = {},
  onChange,
  required = false,
  multiline = false,
  rows = 3,
  placeholder = '',
  className = ''
}) {
  const handleChange = (lang, value) => {
    if (onChange) {
      onChange(lang, value, name)
    }
  }

  const languages = [
    { code: 'ko', label: '한국어', flag: '🇰🇷', required: required },
    { code: 'en', label: 'English', flag: '🇺🇸', required: false },
    { code: 'ja', label: '日本語', flag: '🇯🇵', required: false },
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳', required: false }
  ]

  const InputComponent = multiline ? 'textarea' : 'input'

  return (
    <div className={`mb-6 ${className}`}>
      {/* 그룹 라벨 */}
      {label && (
        <label className="block text-sm font-semibold text-gray-800 mb-3">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* 다국어 입력 필드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {languages.map((lang) => (
          <div key={lang.code}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {lang.flag} {lang.label}
              {lang.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {multiline ? (
              <textarea
                value={values[lang.code] || ''}
                onChange={(e) => handleChange(lang.code, e.target.value)}
                placeholder={placeholder}
                required={lang.required}
                rows={rows}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-vertical"
              />
            ) : (
              <input
                type="text"
                value={values[lang.code] || ''}
                onChange={(e) => handleChange(lang.code, e.target.value)}
                placeholder={placeholder}
                required={lang.required}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
