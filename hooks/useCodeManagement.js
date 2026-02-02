/**
 * 공통코드 관리 커스텀 훅
 */

import { useState, useEffect } from 'react'

export default function useCodeManagement() {
  const [codes, setCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCode, setEditingCode] = useState(null)

  useEffect(() => {
    fetchCodes()
  }, [])

  const fetchCodes = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/common-codes')
      const data = await response.json()
      setCodes(data)
    } catch (error) {
      console.error('Error fetching codes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData) => {
    try {
      const url = editingCode
        ? `http://localhost:3001/api/common-codes/${editingCode.id}`
        : 'http://localhost:3001/api/common-codes'
      
      const method = editingCode ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowModal(false)
        setEditingCode(null)
        fetchCodes()
        alert(editingCode ? '공통코드가 수정되었습니다.' : '공통코드가 등록되었습니다.')
      }
    } catch (error) {
      console.error('Error saving code:', error)
      alert('오류가 발생했습니다.')
    }
  }

  const handleEdit = (code) => {
    setEditingCode(code)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`http://localhost:3001/api/common-codes/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchCodes()
        alert('공통코드가 삭제되었습니다.')
      }
    } catch (error) {
      console.error('Error deleting code:', error)
      alert('오류가 발생했습니다.')
    }
  }

  const openAddModal = () => {
    setEditingCode(null)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingCode(null)
  }

  return {
    codes,
    loading,
    showModal,
    editingCode,
    handleSubmit,
    handleEdit,
    handleDelete,
    openAddModal,
    closeModal
  }
}
