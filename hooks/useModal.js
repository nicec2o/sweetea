/**
 * useModal 훅
 * 
 * @description 모달 상태 관리를 위한 커스텀 훅
 * 
 * @returns {Object} { isOpen, open, close, toggle }
 */

import { useState } from 'react'

export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen(prev => !prev)

  return { isOpen, open, close, toggle }
}
