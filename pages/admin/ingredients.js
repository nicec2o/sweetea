/**
 * 재료관리 페이지
 * 
 * @description 컴포넌트화된 재료 재고 관리 페이지
 * - 재사용 가능한 컴포넌트 활용
 * - 모듈화된 구조
 */

import { useState, useEffect, useRef, useMemo } from 'react'
import Head from 'next/head'

// 공통 컴포넌트
import AdminHeader from '../../components/common/AdminHeader'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import PageHeader from '../../components/common/PageHeader'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'

// 그리드 컴포넌트
import DataGrid from '../../components/grid/DataGrid'

// 재료 전용 컴포넌트
import IngredientForm from '../../components/ingredient/IngredientForm'
import StockAlert from '../../components/ingredient/StockAlert'

export default function IngredientsManagement() {
  const gridRef = useRef()
  
  // 상태 관리
  const [ingredients, setIngredients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState(null)
  
  // 폼 초기값
  const initialFormData = {
    name: '',
    name_en: '',
    name_ja: '',
    name_vi: '',
    unit: '',
    stock: 0,
    min_stock: 0,
    price_per_unit: 0,
    supplier: ''
  }
  
  const [formData, setFormData] = useState(initialFormData)

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
   * 재료 추가 버튼 클릭
   */
  const handleAddNew = () => {
    setEditingIngredient(null)
    setFormData(initialFormData)
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
   * 모달 닫기
   */
  const handleCloseModal = () => {
    setShowModal(false)
    setEditingIngredient(null)
    setFormData(initialFormData)
  }

  /**
   * AG-Grid 컬럼 정의
   */
  const columnDefs = useMemo(() => [
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
  ], [])

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
   * 재고 부족 재료 개수
   */
  const lowStockCount = useMemo(() => 
    ingredients.filter(i => i.stock <= i.min_stock).length,
    [ingredients]
  )

  return (
    <>
      <Head>
        <title>재료관리 - SweeTea Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-100">
        <AdminHeader />

        <main className="container mx-auto px-4 py-8">
          {/* 페이지 헤더 - PageHeader 컴포넌트 사용 */}
          <PageHeader
            title="재료관리"
            actionButton={
              <Button
                onClick={handleAddNew}
                variant="success"
                size="md"
              >
                ➕ 재료 추가
              </Button>
            }
          >
            {/* 재고 부족 알림 - StockAlert 컴포넌트 사용 */}
            <StockAlert count={lowStockCount} />
          </PageHeader>

          {/* 데이터 그리드 */}
          {loading ? (
            <LoadingSpinner size="lg" text="재료를 불러오는 중..." />
          ) : (
            <DataGrid
              ref={gridRef}
              rowData={ingredients}
              columnDefs={columnDefs}
              height={600}
              pageSize={20}
              rowSelection="multiple"
              onCellClicked={onCellClicked}
            />
          )}
        </main>

        {/* 재료 추가/수정 모달 - Modal 컴포넌트 사용 */}
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={editingIngredient ? '재료 수정' : '재료 추가'}
        >
          {/* 재료 폼 - IngredientForm 컴포넌트 사용 */}
          <IngredientForm
            formData={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            isEditing={!!editingIngredient}
          />
        </Modal>
      </div>
    </>
  )
}
