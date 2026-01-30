/**
 * 재료관리 페이지
 * 
 * @description 재료 재고 관리 페이지
 * - AG-Grid를 사용한 재료 목록 표시
 * - 재료 추가/수정/삭제
 * - 재고 부족 알림
 */

import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { AgGridReact } from 'ag-grid-react'

import AdminHeader from '../../components/common/AdminHeader'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function IngredientsManagement() {
  const gridRef = useRef()
  
  const [ingredients, setIngredients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState(null)
  
  // 폼 상태
  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    name_ja: '',
    name_vi: '',
    unit: '',
    stock: 0,
    min_stock: 0,
    price_per_unit: 0,
    supplier: ''
  })

  /**
   * 컴포넌트 마운트 시 재료 조회
   */
  useEffect(() => {
    fetchIngredients()
  }, [])

  /**
   * API에서 재료 목록 조회
   */
  const fetchIngredients = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/ingredients')
      const data = await response.json()
      setIngredients(data)
    } catch (error) {
      console.error('Error fetching ingredients:', error)
      alert('재료를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  /**
   * AG-Grid 컬럼 정의
   */
  const columnDefs = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 80,
      checkboxSelection: true,
      headerCheckboxSelection: true
    },
    { field: 'name', headerName: '재료명', width: 150 },
    { field: 'name_en', headerName: 'Name (EN)', width: 150 },
    { field: 'unit', headerName: '단위', width: 80 },
    { 
      field: 'stock', 
      headerName: '재고', 
      width: 100,
      cellStyle: params => {
        if (params.data.stock <= params.data.min_stock) {
          return { backgroundColor: '#fee', color: '#c00', fontWeight: 'bold' }
        }
        return null
      }
    },
    { field: 'min_stock', headerName: '최소 재고', width: 110 },
    { 
      field: 'price_per_unit', 
      headerName: '단가 (원)', 
      width: 110,
      valueFormatter: params => params.value?.toLocaleString()
    },
    { field: 'supplier', headerName: '공급처', width: 150 },
    {
      headerName: '작업',
      width: 180,
      cellRenderer: params => {
        return `
          <div class="flex gap-2">
            <button 
              class="edit-btn px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              data-id="${params.data.id}"
            >
              수정
            </button>
            <button 
              class="delete-btn px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              data-id="${params.data.id}"
            >
              삭제
            </button>
          </div>
        `
      }
    }
  ]

  /**
   * 그리드 클릭 이벤트 핸들러
   */
  const onCellClicked = (event) => {
    const target = event.event.target
    
    if (target.classList.contains('edit-btn')) {
      const id = parseInt(target.dataset.id)
      const ingredient = ingredients.find(i => i.id === id)
      handleEdit(ingredient)
    } else if (target.classList.contains('delete-btn')) {
      const id = parseInt(target.dataset.id)
      handleDelete(id)
    }
  }

  /**
   * 재료 추가 버튼 클릭
   */
  const handleAddNew = () => {
    setEditingIngredient(null)
    setFormData({
      name: '',
      name_en: '',
      name_ja: '',
      name_vi: '',
      unit: '',
      stock: 0,
      min_stock: 0,
      price_per_unit: 0,
      supplier: ''
    })
    setShowModal(true)
  }

  /**
   * 재료 수정 버튼 클릭
   */
  const handleEdit = (ingredient) => {
    setEditingIngredient(ingredient)
    setFormData({
      name: ingredient.name,
      name_en: ingredient.name_en || '',
      name_ja: ingredient.name_ja || '',
      name_vi: ingredient.name_vi || '',
      unit: ingredient.unit,
      stock: ingredient.stock,
      min_stock: ingredient.min_stock,
      price_per_unit: ingredient.price_per_unit,
      supplier: ingredient.supplier || ''
    })
    setShowModal(true)
  }

  /**
   * 재료 삭제
   */
  const handleDelete = async (id) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/ingredients/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Delete failed')

      alert('재료가 삭제되었습니다.')
      fetchIngredients()
    } catch (error) {
      console.error('Error deleting ingredient:', error)
      alert('재료 삭제에 실패했습니다.')
    }
  }

  /**
   * 폼 제출
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const url = editingIngredient 
        ? `/api/ingredients/${editingIngredient.id}`
        : '/api/ingredients'
      
      const method = editingIngredient ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Submit failed')

      alert(editingIngredient ? '재료가 수정되었습니다.' : '재료가 추가되었습니다.')
      setShowModal(false)
      fetchIngredients()
    } catch (error) {
      console.error('Error submitting ingredient:', error)
      alert('재료 저장에 실패했습니다.')
    }
  }

  /**
   * 재고 부족 재료 개수
   */
  const lowStockCount = ingredients.filter(i => i.stock <= i.min_stock).length

  return (
    <>
      <Head>
        <title>재료관리 - SweeTea Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-100">
        <AdminHeader />

        <main className="container mx-auto px-4 py-8">
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">재료관리</h1>
              {lowStockCount > 0 && (
                <p className="text-red-600 mt-2">
                  ⚠️ 재고 부족 재료: {lowStockCount}개
                </p>
              )}
            </div>
            <button
              onClick={handleAddNew}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              ➕ 재료 추가
            </button>
          </div>

          {/* AG-Grid */}
          {loading ? (
            <LoadingSpinner size="lg" text="재료를 불러오는 중..." />
          ) : (
            <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
              <AgGridReact
                ref={gridRef}
                rowData={ingredients}
                columnDefs={columnDefs}
                defaultColDef={{
                  sortable: true,
                  filter: true,
                  resizable: true
                }}
                rowSelection="multiple"
                onCellClicked={onCellClicked}
                pagination={true}
                paginationPageSize={20}
              />
            </div>
          )}
        </main>

        {/* 재료 추가/수정 모달 */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">
                {editingIngredient ? '재료 수정' : '재료 추가'}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  {/* 재료명 (한국어) */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      재료명 (한국어) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* 재료명 (영어) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name (English)
                    </label>
                    <input
                      type="text"
                      value={formData.name_en}
                      onChange={e => setFormData({...formData, name_en: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* 재료명 (일본어) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      名前 (日本語)
                    </label>
                    <input
                      type="text"
                      value={formData.name_ja}
                      onChange={e => setFormData({...formData, name_ja: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* 재료명 (베트남어) */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên (Tiếng Việt)
                    </label>
                    <input
                      type="text"
                      value={formData.name_vi}
                      onChange={e => setFormData({...formData, name_vi: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* 단위 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      단위 *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="g, ml, 개 등"
                      value={formData.unit}
                      onChange={e => setFormData({...formData, unit: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* 재고 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      현재 재고 *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={e => setFormData({...formData, stock: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* 최소 재고 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      최소 재고 *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.min_stock}
                      onChange={e => setFormData({...formData, min_stock: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* 단가 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      단가 (원)
                    </label>
                    <input
                      type="number"
                      value={formData.price_per_unit}
                      onChange={e => setFormData({...formData, price_per_unit: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* 공급처 */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      공급처
                    </label>
                    <input
                      type="text"
                      value={formData.supplier}
                      onChange={e => setFormData({...formData, supplier: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* 버튼 */}
                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    {editingIngredient ? '수정' : '추가'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
