import { useState, useEffect, useRef, useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { AgGridReact } from 'ag-grid-react'

export default function AdminProducts() {
  const gridRef = useRef()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    name_ja: '',
    description: '',
    description_en: '',
    description_ja: '',
    price: '',
    category: 'MILK_TEA',
    image_url: '',
    stock: ''
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingProduct
        ? `http://localhost:3001/api/products/${editingProduct.id}`
        : 'http://localhost:3001/api/products'
      
      const method = editingProduct ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowModal(false)
        setEditingProduct(null)
        setFormData({
          name: '',
          name_en: '',
          name_ja: '',
          description: '',
          description_en: '',
          description_ja: '',
          price: '',
          category: 'MILK_TEA',
          image_url: '',
          stock: ''
        })
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
    setFormData({
      name: product.name,
      name_en: product.name_en || '',
      name_ja: product.name_ja || '',
      description: product.description || '',
      description_en: product.description_en || '',
      description_ja: product.description_ja || '',
      price: product.price,
      category: product.category,
      image_url: product.image_url || '',
      stock: product.stock
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`http://localhost:3001/api/products/${id}`, {
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

  const columnDefs = useMemo(() => [
    { field: 'id', headerName: 'ID', width: 80, sortable: true, filter: true },
    { field: 'name', headerName: '상품명', width: 200, sortable: true, filter: true },
    { field: 'category', headerName: '카테고리', width: 130, sortable: true, filter: true },
    { 
      field: 'price', 
      headerName: '가격', 
      width: 120, 
      sortable: true,
      valueFormatter: params => `₩${params.value.toLocaleString()}`
    },
    { field: 'stock', headerName: '재고', width: 100, sortable: true },
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
        <title>상품관리 - SweeTea Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">상품관리</h1>
              <div className="flex gap-4">
                <Link href="/admin" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                  대시보드
                </Link>
                <Link href="/admin/products" className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                  상품관리
                </Link>
                <Link href="/admin/orders" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                  주문관리
                </Link>
                <Link href="/admin/codes" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
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
              <h2 className="text-xl font-bold text-gray-800">상품 목록</h2>
              <button
                onClick={() => {
                  setEditingProduct(null)
                  setFormData({
                    name: '',
                    name_en: '',
                    name_ja: '',
                    description: '',
                    description_en: '',
                    description_ja: '',
                    price: '',
                    category: 'MILK_TEA',
                    image_url: '',
                    stock: ''
                  })
                  setShowModal(true)
                }}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                + 상품 추가
              </button>
            </div>

            <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
              <AgGridReact
                ref={gridRef}
                rowData={products}
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
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  {editingProduct ? '상품 수정' : '상품 추가'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">상품명 (한국어)</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">상품명 (English)</label>
                      <input
                        type="text"
                        value={formData.name_en}
                        onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">상품명 (日本語)</label>
                      <input
                        type="text"
                        value={formData.name_ja}
                        onChange={(e) => setFormData({...formData, name_ja: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">설명 (한국어)</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        rows="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">설명 (English)</label>
                      <textarea
                        value={formData.description_en}
                        onChange={(e) => setFormData({...formData, description_en: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        rows="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">설명 (日本語)</label>
                      <textarea
                        value={formData.description_ja}
                        onChange={(e) => setFormData({...formData, description_ja: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        rows="3"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">가격</label>
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="MILK_TEA">밀크티</option>
                        <option value="FRUIT_TEA">과일티</option>
                        <option value="COFFEE">커피</option>
                        <option value="SMOOTHIE">스무디</option>
                        <option value="ADE">에이드</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">이미지 URL</label>
                      <input
                        type="text"
                        value={formData.image_url}
                        onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">재고</label>
                      <input
                        type="number"
                        required
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
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
                      {editingProduct ? '수정' : '등록'}
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
