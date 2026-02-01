/**
 * NumberInput 컴포넌트
 * 
 * @description 숫자 전용 입력 컴포넌트
 * - 최소/최대값 검증
 * - 천 단위 구분 표시 옵션
 * 
 * @param {Object} props
 * @param {string} props.label - 라벨 텍스트
 * @param {string} props.name - input name 속성
 * @param {number} props.value - 입력값
 * @param {Function} props.onChange - 변경 핸들러
 * @param {number} props.min - 최소값
 * @param {number} props.max - 최대값
 * @param {number} props.step - 증감 단위
 * @param {boolean} props.showCommas - 천 단위 구분 표시 여부
 * @param {boolean} props.required - 필수 여부
 * @param {string} props.error - 에러 메시지
 */

export default function NumberInput({
  label,
  name,
  value,
  onChange,
  min,
  max,
  step = 1,
  showCommas = false,
  required = false,
  disabled = false,
  error,
  placeholder,
  className = '',
  ...rest
}) {
  const handleChange = (e) => {
    const numValue = e.target.value === '' ? '' : Number(e.target.value)
    if (onChange) {
      onChange(numValue, name, e)
    }
  }

  // 천 단위 구분 표시
  const displayValue = showCommas && value !== '' && value !== null && value !== undefined
    ? Number(value).toLocaleString()
    : value

  return (
    <div className={`mb-4 ${className}`}>
      {/* 라벨 */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* 숫자 입력 필드 */}
      {showCommas ? (
        <input
          type="text"
          name={name}
          value={displayValue}
          onChange={(e) => {
            // 콤마 제거 후 숫자만 추출
            const numStr = e.target.value.replace(/,/g, '')
            if (numStr === '' || /^\d+$/.test(numStr)) {
              const numValue = numStr === '' ? '' : Number(numStr)
              if (onChange) {
                onChange(numValue, name, e)
              }
            }
          }}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            w-full px-4 py-2 border rounded-lg
            focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${disabled ? 'text-gray-500' : 'text-gray-900'}
          `}
          {...rest}
        />
      ) : (
        <input
          type="number"
          name={name}
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            w-full px-4 py-2 border rounded-lg
            focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${disabled ? 'text-gray-500' : 'text-gray-900'}
          `}
          {...rest}
        />
      )}

      {/* 에러 메시지 */}
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}
