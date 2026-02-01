/**
 * FormTextarea 컴포넌트
 * 
 * @description 재사용 가능한 텍스트 영역 컴포넌트
 * 
 * @param {Object} props
 * @param {string} props.label - 라벨 텍스트
 * @param {string} props.name - textarea name 속성
 * @param {string} props.value - 입력값
 * @param {Function} props.onChange - 변경 핸들러
 * @param {string} props.placeholder - placeholder 텍스트
 * @param {number} props.rows - 행 수
 * @param {boolean} props.required - 필수 여부
 * @param {boolean} props.disabled - 비활성화 여부
 * @param {string} props.error - 에러 메시지
 */

export default function FormTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
  disabled = false,
  error,
  className = '',
  ...rest
}) {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value, name, e)
    }
  }

  return (
    <div className={`mb-4 ${className}`}>
      {/* 라벨 */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* 텍스트 영역 */}
      <textarea
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        disabled={disabled}
        className={`
          w-full px-4 py-2 border rounded-lg
          focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          resize-vertical
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'text-gray-500' : 'text-gray-900'}
        `}
        {...rest}
      />

      {/* 에러 메시지 */}
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}
