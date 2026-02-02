/**
 * 상품관리 페이지
 * 
 * @description 완전히 컴포넌트화된 상품 관리 페이지
 */

import { useState, useEffect, useRef, useMemo } from 'react'
import Head from 'next/head'
import AdminHeader from '../../components/common/AdminHeader'
import DataGrid from '../../components/grid/DataGrid'
import ProductFormModal from '../../components/admin/ProductFormModal'
import { ActionButtons } from '../../components/admin/GridActionButtons'
import { useModal } from '../../hooks/useModal'

export default function AdminProducts() {
  const gridRef = useRef()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { isOpen, open, close } = useModal()
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData) => {
    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : '/api/products'
      
      const method = editingProduct ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        close()
        setEditingProduct(null)
        fetchProducts()
        alert(editingProduct ? '상품이 수정되었습니다.' : '상품이 등록되었습니다.')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('오류가 발생했습니다.')
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    open()
  }

  const handleDelete = async (id) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchProducts()
        alert('상품이 삭제되었습니다.')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('오류가 발생했습니다.')
    }
  }

  const handleAddNew = () => {
    setEditingProduct(null)
    open()
  }

  const columnDefs = useMemo(() => [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: '상품명', width: 200 },
    { field: 'category', headerName: '카테고리', width: 130 },
    { 
      field: 'price', 
      headerName: '가격', 
      width: 120,
      valueFormatter: params => `₩${params.value.toLocaleString()}`
    },
    { field: 'stock', headerName: '재고', width: 100 },
    {
      field: 'actions',
      headerName: '관리',
      width: 200,
      cellRenderer: ActionButtons,
      cellRendererParams: {
        onEdit: handleEdit,
        onDelete: handleDelete
      }
    }
  ], [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>상품관리 - SweeTea Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-100">
        <AdminHeader currentPage="products" />

        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">상품 목록</h2>
              <button
                onClick={handleAddNew}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                + 상품 추가
              </button>
            </div>

            <DataGrid
              ref={gridRef}
              rowData={products}
              columnDefs={columnDefs}
              height={600}
              pageSize={20}
            />
          </div>
        </main>

        {/* 상품 추가/수정 모달 */}
        <ProductFormModal
          isOpen={isOpen}
          onClose={() => {
            close()
            setEditingProduct(null)
          }}
          onSubmit={handleSubmit}
          initialData={editingProduct}
        />
      </div>
    </>
  )
}
