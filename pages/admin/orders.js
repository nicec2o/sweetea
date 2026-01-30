/**
 * 주문관리 페이지 (주문 직접 입력 기능 포함)
 */

import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { AgGridReact } from 'ag-grid-react'

import AdminHeader from '../../components/common/AdminHeader'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import OrderStatusBadge from '../../components/admin/OrderStatusBadge'

export default function AdminOrders() {
  const gridRef = useRef()
  
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  
  // 주문 입력 폼 상태
  const [formData, setFormData] = useState({
    user_id: '',
    shipping_address: '',
    phone: '',
    payment_method: 'CARD',
    items: []
  })

  // 상품 추가 임시 상태
  const [tempItem, setTempItem] = useState({
    product_id: '',
    quantity: 1
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products'),
        fetch('/api/users')
      ])
      
      const ordersData = await ordersRes.json()
      const productsData = await productsRes.json()
      const usersData = await usersRes.json()
      
      setOrders(ordersData)
      setProducts(productsData)
      setUsers(usersData)
    } catch (error) {
      console.error('Error fetching data:', error)
      alert('데이터를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  /**
   * 주문 상태 변경
   */
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) throw new Error('Update failed')

      alert('주문 상태가 변경되었습니다.')
      fetchData()
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('주문 상태 변경에 실패했습니다.')
    }
  }

  /**
   * 주문 삭제
   */
  const handleDelete = async (orderId) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Delete failed')

      alert('주문이 삭제되었습니다.')
      fetchData()
    } catch (error) {
      console.error('Error deleting order:', error)
      alert('주문 삭제에 실패했습니다.')
    }
  }

  /**
   * AG-Grid 컬럼 정의
   */
  const columnDefs = [
    { field: 'id', headerName: '주문번호', width: 100 },
    { field: 'user_name', headerName: '고객명', width: 120 },
    { field: 'email', headerName: '이메일', width: 200 },
    { 
      field: 'total_amount', 
      headerName: '주문금액', 
      width: 120,
      valueFormatter: params => `₩${params.value?.toLocaleString()}`
    },
    {
      field: 'status',
      headerName: '주문상태',
      width: 150,
      cellRenderer: params => {
        const statusOptions = [
          { value: 'PENDING', label: '대기중' },
          { value: 'CONFIRMED', label: '확인됨' },
          { value: 'PREPARING', label: '준비중' },
          { value: 'SHIPPING', label: '배송중' },
          { value: 'COMPLETED', label: '완료' },
          { value: 'CANCELLED', label: '취소됨' }
        ]

        return `
          <select 
            class="status-select px-2 py-1 border rounded"
            data-id="${params.data.id}"
          >
            ${statusOptions.map(opt => 
              `<option value="${opt.value}" ${params.value === opt.value ? 'selected' : ''}>
                ${opt.label}
              </option>`
            ).join('')}
          </select>
        `
      }
    },
    { field: 'phone', headerName: '연락처', width: 130 },
    { 
      field: 'created_at', 
      headerName: '주문일시', 
      width: 180,
      valueFormatter: params => new Date(params.value).toLocaleString('ko-KR')
    },
    {
      headerName: '작업',
      width: 100,
      cellRenderer: params => {
        return `
          <button 
            class="delete-btn px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            data-id="${params.data.id}"
          >
            삭제
          </button>
        `
      }
    }
  ]

  /**
   * 그리드 클릭 이벤트 핸들러
   */
  const onCellClicked = (event) => {
    const target = event.event.target
    
    if (target.classList.contains('status-select')) {
      target.addEventListener('change', (e) => {
        const orderId = parseInt(e.target.dataset.id)
        const newStatus = e.target.value
        handleStatusChange(orderId, newStatus)
      })
    } else if (target.classList.contains('delete-btn')) {
      const id = parseInt(target.dataset.id)
      handleDelete(id)
    }
  }

  /**
   * 새 주문 추가 모달 열기
   */
  const handleAddNew = () => {
    setFormData({
      user_id: '',
      shipping_address: '',
      phone: '',
      payment_method: 'CARD',
      items: []
    })
    setTempItem({
      product_id: '',
      quantity: 1
    })
    setShowModal(true)
  }

  /**
   * 상품을 주문 항목에 추가
   */
  const addItemToOrder = () => {
    if (!tempItem.product_id) {
      alert('상품을 선택해주세요.')
      return
    }

    const product = products.find(p => p.id === parseInt(tempItem.product_id))
    if (!product) return

    const newItem = {
      product_id: product.id,
      product_name: product.name,
      quantity: parseInt(tempItem.quantity),
      price: product.price
    }

    setFormData({
      ...formData,
      items: [...formData.items, newItem]
    })

    setTempItem({
      product_id: '',
      quantity: 1
    })
  }

  /**
   * 주문 항목 삭제
   */
  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index)
    setFormData({ ...formData, items: newItems })
  }

  /**
   * 총 금액 계산
   */
  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  /**
   * 주문 제출
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.user_id) {
      alert('고객을 선택해주세요.')
      return
    }

    if (formData.items.length === 0) {
      alert('상품을 추가해주세요.')
      return
    }

    try {
      const orderData = {
        user_id: parseInt(formData.user_id),
        items: formData.items,
        total_amount: calculateTotal(),
        shipping_address: formData.shipping_address,
        phone: formData.phone,
        payment_method: formData.payment_method
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Submit failed')
      }

      alert('주문이 등록되었습니다.')
      setShowModal(false)
      fetchData()
    } catch (error) {
      console.error('Error submitting order:', error)
      alert(`주문 등록에 실패했습니다: ${error.message}`)
    }
  }

  return (
    <>
      <Head>
        <title>주문관리 - SweeTea Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-100">
        <AdminHeader />

        <main className="container mx-auto px-4 py-8">
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">주문관리</h1>
            <button
              onClick={handleAddNew}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              ➕ 주문 직접 입력
            </button>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">전체 주문</h3>
              <p className="text-3xl font-bold text-gray-800">{orders.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">대기중</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {orders.filter(o => o.status === 'PENDING').length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">배송중</h3>
              <p className="text-3xl font-bold text-blue-600">
                {orders.filter(o => o.status === 'SHIPPING').length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">완료</h3>
              <p className="text-3xl font-bold text-green-600">
                {orders.filter(o => o.status === 'COMPLETED').length}
              </p>
            </div>
          </div>

          {/* AG-Grid */}
          {loading ? (
            <LoadingSpinner size="lg" text="주문을 불러오는 중..." />
          ) : (
            <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
              <AgGridReact
                ref={gridRef}
                rowData={orders}
                columnDefs={columnDefs}
                defaultColDef={{
                  sortable: true,
                  filter: true,
                  resizable: true
                }}
                onCellClicked={onCellClicked}
                pagination={true}
                paginationPageSize={20}
              />
            </div>
          )}
        </main>

        {/* 주문 입력 모달 */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">주문 직접 입력</h2>

              <form onSubmit={handleSubmit}>
                {/* 고객 선택 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    고객 선택 *
                  </label>
                  <select
                    required
                    value={formData.user_id}
                    onChange={e => setFormData({...formData, user_id: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">고객을 선택하세요</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 배송 정보 */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      배송 주소
                    </label>
                    <input
                      type="text"
                      value={formData.shipping_address}
                      onChange={e => setFormData({...formData, shipping_address: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      연락처
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* 결제 방법 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    결제 방법
                  </label>
                  <select
                    value={formData.payment_method}
                    onChange={e => setFormData({...formData, payment_method: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="CARD">카드</option>
                    <option value="CASH">현금</option>
                    <option value="TRANSFER">계좌이체</option>
                  </select>
                </div>

                {/* 상품 추가 */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-4">상품 추가</h3>
                  <div className="flex gap-4">
                    <select
                      value={tempItem.product_id}
                      onChange={e => setTempItem({...tempItem, product_id: e.target.value})}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">상품을 선택하세요</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} - ₩{product.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={tempItem.quantity}
                      onChange={e => setTempItem({...tempItem, quantity: e.target.value})}
                      className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addItemToOrder}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      추가
                    </button>
                  </div>
                </div>

                {/* 주문 항목 목록 */}
                {formData.items.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-4">주문 항목</h3>
                    <table className="w-full border-collapse border">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-2 text-left">상품명</th>
                          <th className="border p-2 text-right">단가</th>
                          <th className="border p-2 text-center">수량</th>
                          <th className="border p-2 text-right">소계</th>
                          <th className="border p-2 text-center">삭제</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.items.map((item, index) => (
                          <tr key={index}>
                            <td className="border p-2">{item.product_name}</td>
                            <td className="border p-2 text-right">₩{item.price.toLocaleString()}</td>
                            <td className="border p-2 text-center">{item.quantity}</td>
                            <td className="border p-2 text-right">
                              ₩{(item.price * item.quantity).toLocaleString()}
                            </td>
                            <td className="border p-2 text-center">
                              <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-100 font-bold">
                          <td colSpan="3" className="border p-2 text-right">총 금액</td>
                          <td className="border p-2 text-right">₩{calculateTotal().toLocaleString()}</td>
                          <td className="border p-2"></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}

                {/* 버튼 */}
                <div className="flex gap-4">
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
                    주문 등록
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
