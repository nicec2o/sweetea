/**
 * FormSelect 컴포넌트
 * 
 * @description 재사용 가능한 셀렉트 박스 컴포넌트
 * 
 * @param {Object} props
 * @param {string} props.label - 라벨 텍스트
 * @param {string} props.name - select name 속성
 * @param {string|number} props.value - 선택된 값
 * @param {Function} props.onChange - 변경 핸들러
 * @param {Array} props.options - 옵션 배열 [{value, label}]
 * @param {boolean} props.required - 필수 여부
 * @param {boolean} props.disabled - 비활성화 여부
 * @param {string} props.error - 에러 메시지
 * @param {string} props.placeholder - 첫 번째 옵션 텍스트
 */

export default function FormSelect({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  disabled = false,
  error,
  placeholder = '선택하세요',
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

      {/* 셀렉트 박스 */}
      <select
        name={name}
        value={value}
        onChange={handleChange}
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
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option, index) => (
          <option 
            key={option.value || index} 
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {/* 에러 메시지 */}
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}
