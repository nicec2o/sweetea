/**
 * useForm 훅
 * 
 * @description 폼 상태 관리 커스텀 훅
 * - 값 변경, 리셋, 일괄 설정
 * 
 * @param {Object} initialValues - 초기값
 * @returns {Object} { values, handleChange, reset, setValues }
 */

import { useState } from 'react'

export default function useForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues)

  /**
   * 필드 값 변경 핸들러
   * @param {string|number} value - 새 값
   * @param {string} name - 필드 이름
   */
  const handleChange = (value, name) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }))
  }

  /**
   * 다국어 필드 변경 핸들러
   * @param {string} lang - 언어 코드 (ko, en, ja, vi)
   * @param {string} value - 새 값
   * @param {string} baseName - 기본 필드 이름
   */
  const handleMultiLangChange = (lang, value, baseName) => {
    const fieldName = lang === 'ko' ? baseName : `${baseName}_${lang}`
    handleChange(value, fieldName)
  }

  /**
   * 폼 리셋
   */
  const reset = () => {
    setValues(initialValues)
  }

  /**
   * 특정 필드만 업데이트
   * @param {Object} updates - 업데이트할 필드들
   */
  const updateFields = (updates) => {
    setValues(prev => ({
      ...prev,
      ...updates
    }))
  }

  return {
    values,
    handleChange,
    handleMultiLangChange,
    reset,
    setValues,
    updateFields
  }
}
