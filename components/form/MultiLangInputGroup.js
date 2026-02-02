/**
 * MultiLangInputGroup 컴포넌트
 * 
 * @description 다국어 입력 필드 그룹
 */

import FormInput from './FormInput'

export default function MultiLangInputGroup({
  label,
  name,
  values,
  onChange,
  required = false,
  type = 'text',
  placeholder
}) {
  const languages = [
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' }
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {languages.map((lang, index) => (
          <FormInput
            key={lang.code}
            label={`${lang.flag} ${lang.label}`}
            name={`${name}_${lang.code}`}
            type={type}
            value={values[lang.code] || ''}
            onChange={(value) => onChange(lang.code, value)}
            required={required && index === 0}
            placeholder={placeholder}
            className={index === 0 ? 'md:col-span-2' : ''}
          />
        ))}
      </div>
    </div>
  )
}
