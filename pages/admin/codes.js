import { useState, useEffect, useRef, useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { AgGridReact } from 'ag-grid-react'

export default function AdminCommonCodes() {
  const gridRef = useRef()
  const [codes, setCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCode, setEditingCode] = useState(null)
  const [formData, setFormData] = useState({
    code_group: '',
    code: '',
    code_name: '',
    code_name_en: '',
    code_name_ja: '',
    sort_order: 0,
    use_yn: 'Y'
  })

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

  const handleSubmit = async (e) => {
    e.preventDefault()
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
        setFormData({
          code_group: '',
          code: '',
          code_name: '',
          code_name_en: '',
          code_name_ja: '',
          sort_order: 0,
          use_yn: 'Y'
        })
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
    setFormData({
      code_group: code.code_group,
      code: code.code,
      code_name: code.code_name,
      code_name_en: code.code_name_en || '',
      code_name_ja: code.code_name_ja || '',
      sort_order: code.sort_order,
      use_yn: code.use_yn
    })
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

  const columnDefs = useMemo(() => [
    { field: 'id', headerName: 'ID', width: 80, sortable: true, filter: true },
    { field: 'code_group', headerName: '코드그룹', width: 150, sortable: true, filter: true },
    { field: 'code', headerName: '코드', width: 150, sortable: true, filter: true },
    { field: 'code_name', headerName: '코드명(KO)', width: 150, sortable: true, filter: true },
    { field: 'code_name_en', headerName: '코드명(EN)', width: 150, sortable: true, filter: true },
    { field: 'code_name_ja', headerName: '코드명(JA)', width: 150, sortable: true, filter: true },
    { field: 'sort_order', headerName: '정렬순서', width: 100, sortable: true },
    { 
      field: 'use_yn', 
      headerName: '사용여부', 
      width: 100, 
      sortable: true,
      cellRenderer: (params) => {
        return params.value === 'Y' 
          ? <span className="text-green-600 font-semibold">사용</span>
          : <span className="text-red-600 font-semibold">미사용</span>
      }
    },
    {
      field: 'actions',
      headerName: '관리',
      width: 200,
      cellRenderer: (params) => {
        return (
          <div className="flex gap-2 items-center h-full">
            <button
              onClick={() => handleEdit(params.data)}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              수정
            </button>
            <button
              onClick={() => handleDelete(params.data.id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              삭제
            </button>
          </div>
        )
      }
    }
  ], [])

  const defaultColDef = useMemo(() => ({
    resizable: true,
  }), [])

  return (
    <>
      <Head>
        <title>공통코드 관리 - SweeTea Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">공통코드 관리</h1>
              <div className="flex gap-4">
                <Link href="/admin" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                  대시보드
                </Link>
                <Link href="/admin/products" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                  상품관리
                </Link>
                <Link href="/admin/orders" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                  주문관리
                </Link>
                <Link href="/admin/codes" className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                  공통코드
                </Link>
                <Link href="/" className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
                  쇼핑몰
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">공통코드 목록</h2>
              <button
                onClick={() => {
                  setEditingCode(null)
                  setFormData({
                    code_group: '',
                    code: '',
                    code_name: '',
                    code_name_en: '',
                    code_name_ja: '',
                    sort_order: 0,
                    use_yn: 'Y'
                  })
                  setShowModal(true)
                }}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                + 코드 추가
              </button>
            </div>

            <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
              <AgGridReact
                ref={gridRef}
                rowData={codes}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={20}
                animateRows={true}
              />
            </div>
          </div>
        </main>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  {editingCode ? '공통코드 수정' : '공통코드 추가'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">코드그룹</label>
                      <input
                        type="text"
                        required
                        value={formData.code_group}
                        onChange={(e) => setFormData({...formData, code_group: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="예: CATEGORY, ORDER_STATUS"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">코드</label>
                      <input
                        type="text"
                        required
                        value={formData.code}
                        onChange={(e) => setFormData({...formData, code: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="예: MILK_TEA, pending"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">코드명 (한국어)</label>
                      <input
                        type="text"
                        required
                        value={formData.code_name}
                        onChange={(e) => setFormData({...formData, code_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">코드명 (English)</label>
                      <input
                        type="text"
                        value={formData.code_name_en}
                        onChange={(e) => setFormData({...formData, code_name_en: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">코드명 (日本語)</label>
                      <input
                        type="text"
                        value={formData.code_name_ja}
                        onChange={(e) => setFormData({...formData, code_name_ja: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">정렬순서</label>
                      <input
                        type="number"
                        value={formData.sort_order}
                        onChange={(e) => setFormData({...formData, sort_order: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">사용여부</label>
                      <select
                        value={formData.use_yn}
                        onChange={(e) => setFormData({...formData, use_yn: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="Y">사용</option>
                        <option value="N">미사용</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                    >
                      {editingCode ? '수정' : '등록'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
