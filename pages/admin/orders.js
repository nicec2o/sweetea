/**
 * 주문관리 페이지 (주문 직접 입력 기능 포함 + OCR)
 */

import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { AgGridReact } from 'ag-grid-react'
import Tesseract from 'tesseract.js'

import AdminHeader from '../../components/common/AdminHeader'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { StatusSelect } from '../../components/admin/GridActionButtons'

export default function AdminOrders() {
  const gridRef = useRef()
  const fileInputRef = useRef()
  
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [ocrProcessing, setOcrProcessing] = useState(false)
  const [ocrText, setOcrText] = useState('')
  
  // 고객 정보 상태
  const [customerName, setCustomerName] = useState('')
  const [customerInfo, setCustomerInfo] = useState(null)
  const [isNewCustomer, setIsNewCustomer] = useState(true)
  
  // 주문 입력 폼 상태
  const [formData, setFormData] = useState({
    customer_name: '',
    shipping_address: '',
    shipping_address_detail: '',
    phone: '',
    payment_method: 'TRANSFER',
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
   * 고객명 입력 시 기존 고객 검색
   */
  const handleCustomerNameBlur = () => {
    const trimmedName = customerName.trim()
    if (!trimmedName) return

    const existingUser = users.find(u => u.name === trimmedName)
    
    if (existingUser) {
      setCustomerInfo(existingUser)
      setIsNewCustomer(false)
      setFormData({
        ...formData,
        customer_name: existingUser.name,
        phone: existingUser.phone || '',
        shipping_address: existingUser.address || '',
        shipping_address_detail: ''
      })
    } else {
      setCustomerInfo(null)
      setIsNewCustomer(true)
      setFormData({
        ...formData,
        customer_name: trimmedName,
        phone: '',
        shipping_address: '',
        shipping_address_detail: ''
      })
    }
  }

  /**
   * OCR로 이미지에서 텍스트 추출
   */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setOcrProcessing(true)
      
      const { data: { text } } = await Tesseract.recognize(
        file,
        'kor+eng',
        {
          logger: m => console.log(m)
        }
      )

      setOcrText(text)

      // OCR 결과 파싱
      const lines = text.split('\n').map(line => line.trim()).filter(Boolean)
      
      let extractedName = ''
      let extractedPhone = ''
      let extractedAddress = ''

      lines.forEach(line => {
        // 전화번호 패턴
        const phoneMatch = line.match(/01[0-9]-?[0-9]{3,4}-?[0-9]{4}/)
        if (phoneMatch) {
          extractedPhone = phoneMatch[0].replace(/-/g, '')
        }

        // 이름 추출
        if (!extractedName && /^[가-힣]{2,4}$/.test(line)) {
          extractedName = line
        }

        // 주소 추출
        if (line.includes('시') || line.includes('구') || line.includes('동')) {
          extractedAddress += line + ' '
        }
      })

      // 추출된 정보를 폼에 입력
      if (extractedName) {
        setCustomerName(extractedName)
        setFormData(prev => ({ ...prev, customer_name: extractedName }))
      }
      if (extractedPhone) {
        setFormData(prev => ({ ...prev, phone: extractedPhone }))
      }
      if (extractedAddress) {
        setFormData(prev => ({ ...prev, shipping_address: extractedAddress.trim() }))
      }
      
    } catch (error) {
      console.error('OCR Error:', error)
      alert('이미지 인식에 실패했습니다.')
    } finally {
      setOcrProcessing(false)
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
      cellRenderer: StatusSelect,
      cellRendererParams: {
        onStatusChange: handleStatusChange
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
      cellRenderer: (params) => (
        <button 
          onClick={() => handleDelete(params.data.id)}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
        >
          삭제
        </button>
      )
    }
  ]

  /**
   * 새 주문 추가 모달 열기
   */
  const handleAddNew = () => {
    setCustomerName('')
    setCustomerInfo(null)
    setIsNewCustomer(true)
    setOcrText('')
    setFormData({
      customer_name: '',
      shipping_address: '',
      shipping_address_detail: '',
      phone: '',
      payment_method: 'TRANSFER',
      items: []
    })
    
    // 밀크티 기본 선택
    const milkTea = products.find(p => p.category === 'MILK_TEA')
    setTempItem({
      product_id: milkTea?.id || '',
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

    if (!formData.customer_name) {
      alert('고객명을 입력해주세요.')
      return
    }

    if (!formData.phone) {
      alert('전화번호를 입력해주세요.')
      return
    }

    if (formData.items.length === 0) {
      alert('상품을 추가해주세요.')
      return
    }

    try {
      let userId = customerInfo?.id

      // 신규 고객이면 먼저 고객 생성
      if (isNewCustomer) {
        const fullAddress = formData.shipping_address_detail 
          ? `${formData.shipping_address} ${formData.shipping_address_detail}`
          : formData.shipping_address

        const userResponse = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.customer_name,
            email: `${formData.phone}@temp.com`,
            phone: formData.phone,
            address: fullAddress,
            password: 'temp123'
          })
        })

        if (!userResponse.ok) throw new Error('User creation failed')
        
        const newUser = await userResponse.json()
        userId = newUser.user?.id || newUser.id
      }

      // 주문 생성
      const fullAddress = formData.shipping_address_detail 
        ? `${formData.shipping_address} ${formData.shipping_address_detail}`
        : formData.shipping_address

      const orderData = {
        user_id: userId,
        items: formData.items,
        total_amount: calculateTotal(),
        shipping_address: fullAddress,
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
        <AdminHeader currentPage="orders" />

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
                {/* OCR 이미지 업로드 */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-dashed border-blue-300">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-blue-800">📸 고객 정보 이미지 인식 (OCR)</h3>
                      <p className="text-sm text-blue-600">명함, 메모, 스크린샷에서 고객 정보를 자동으로 추출합니다</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={ocrProcessing}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                      {ocrProcessing ? '처리중...' : '이미지 선택'}
                    </button>
                  </div>
                  
                  {/* OCR 결과 텍스트 편집 가능 */}
                  {ocrText && (
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-blue-800 mb-2">
                        추출된 텍스트 (수정 가능):
                      </label>
                      <textarea
                        value={ocrText}
                        onChange={(e) => setOcrText(e.target.value)}
                        className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        rows="6"
                        placeholder="추출된 텍스트가 여기에 표시됩니다. 수정할 수 있습니다."
                      />
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* 고객 정보 */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-4">고객 정보</h3>
                  
                  {/* 고객명 입력 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      고객명 *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      onBlur={handleCustomerNameBlur}
                      placeholder="고객 이름을 입력하세요"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* 기존 고객 정보 표시 */}
                  {customerInfo && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-300 rounded">
                      <p className="text-sm font-semibold text-green-800">✅ 기존 고객 정보</p>
                      <p className="text-sm text-gray-700">전화번호: {customerInfo.phone || '없음'}</p>
                      <p className="text-sm text-gray-700">주소: {customerInfo.address || '없음'}</p>
                    </div>
                  )}

                  {isNewCustomer && customerName && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded">
                      <p className="text-sm font-semibold text-yellow-800">🆕 신규 고객</p>
                      <p className="text-sm text-gray-700">주문 완료 시 자동으로 고객 정보가 생성됩니다</p>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      전화번호 *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      placeholder="010-XXXX-XXXX"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      주소
                    </label>
                    <input
                      type="text"
                      value={formData.shipping_address}
                      onChange={e => setFormData({...formData, shipping_address: e.target.value})}
                      placeholder="시, 구, 동"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      상세주소
                    </label>
                    <input
                      type="text"
                      value={formData.shipping_address_detail}
                      onChange={e => setFormData({...formData, shipping_address_detail: e.target.value})}
                      placeholder="건물명, 동/호수"
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
                    <option value="TRANSFER">계좌이체</option>
                    <option value="CARD">카드</option>
                    <option value="CASH">현금</option>
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
                          {product.name} ({product.category}) - ₩{product.price.toLocaleString()}
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
