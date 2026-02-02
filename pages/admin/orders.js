/**
 * 주문관리 페이지 (최대 컴포넌트화 버전)
 * 
 * @description 재사용 가능한 컴포넌트로 완전히 분리된 주문 관리 페이지
 */

import { useState, useEffect, useRef, useMemo } from 'react'
import Head from 'next/head'
import Tesseract from 'tesseract.js'

// 공통 컴포넌트
import AdminHeader from '../../components/common/AdminHeader'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import PageHeader from '../../components/common/PageHeader'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'

// 그리드 컴포넌트
import DataGrid from '../../components/grid/DataGrid'
import DataTable from '../../components/grid/DataTable'

// 폼 컴포넌트
import FormSelect from '../../components/form/FormSelect'

// 어드민 컴포넌트
import { StatusSelect } from '../../components/admin/GridActionButtons'
import StatCard from '../../components/admin/StatCard'
import StatsGrid from '../../components/admin/StatsGrid'

// 주문 전용 컴포넌트
import OCRUploader from '../../components/order/OCRUploader'
import CustomerInfoForm from '../../components/order/CustomerInfoForm'
import OrderItemSelector from '../../components/order/OrderItemSelector'
import OrderSummary from '../../components/order/OrderSummary'

export default function AdminOrders() {
  const gridRef = useRef()
  
  // 데이터 상태
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  
  // 모달 및 OCR 상태
  const [showModal, setShowModal] = useState(false)
  const [ocrProcessing, setOcrProcessing] = useState(false)
  const [ocrText, setOcrText] = useState('')
  
  // 고객 정보 상태
  const [customerName, setCustomerName] = useState('')
  const [customerInfo, setCustomerInfo] = useState(null)
  const [isNewCustomer, setIsNewCustomer] = useState(true)
  
  // 폼 초기값
  const initialFormData = {
    customer_name: '',
    shipping_address: '',
    shipping_address_detail: '',
    phone: '',
    payment_method: 'TRANSFER',
    items: []
  }
  
  const [formData, setFormData] = useState(initialFormData)
  
  // 상품 추가 임시 상태
  const [tempItem, setTempItem] = useState({
    product_id: '',
    quantity: 1
  })

  useEffect(() => {
    fetchData()
  }, [])

  /**
   * 데이터 조회
   */
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
   * OCR 이미지 업로드
   */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setOcrProcessing(true)
      
      const { data: { text } } = await Tesseract.recognize(file, 'kor+eng')
      setOcrText(text)

      // OCR 결과 파싱
      const lines = text.split('\n').map(line => line.trim()).filter(Boolean)
      let extractedName = ''
      let extractedPhone = ''
      let extractedAddress = ''

      lines.forEach(line => {
        const phoneMatch = line.match(/01[0-9]-?[0-9]{3,4}-?[0-9]{4}/)
        if (phoneMatch) extractedPhone = phoneMatch[0].replace(/-/g, '')
        if (!extractedName && /^[가-힣]{2,4}$/.test(line)) extractedName = line
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
   * 새 주문 추가 모달 열기
   */
  const handleAddNew = () => {
    setCustomerName('')
    setCustomerInfo(null)
    setIsNewCustomer(true)
    setOcrText('')
    setFormData(initialFormData)
    
    const milkTea = products.find(p => p.category === 'MILK_TEA')
    setTempItem({
      product_id: milkTea?.id || '',
      quantity: 1
    })
    
    setShowModal(true)
  }

  /**
   * 모달 닫기
   */
  const handleCloseModal = () => {
    setShowModal(false)
    setCustomerName('')
    setCustomerInfo(null)
    setIsNewCustomer(true)
    setOcrText('')
    setFormData(initialFormData)
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

    setTempItem({ product_id: '', quantity: 1 })
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

  /**
   * AG-Grid 컬럼 정의
   */
  const columnDefs = useMemo(() => [
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
        `<button 
          class="delete-order-btn px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          data-id="${params.data.id}"
        >
          삭제
        </button>`
      )
    }
  ], [])

  /**
   * 셀 클릭 핸들러
   */
  const onCellClicked = (event) => {
    const target = event.event.target
    
    if (target.classList.contains('delete-order-btn')) {
      const id = parseInt(target.dataset.id)
      handleDelete(id)
    }
  }

  /**
   * 주문 항목 테이블 컬럼 정의
   */
  const orderItemColumns = [
    { key: 'product_name', header: '상품명' },
    {
      key: 'price',
      header: '단가',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (value) => `₩${value.toLocaleString()}`
    },
    {
      key: 'quantity',
      header: '수량',
      headerClassName: 'text-center',
      className: 'text-center'
    },
    {
      key: 'subtotal',
      header: '소계',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (_, row) => `₩${(row.price * row.quantity).toLocaleString()}`
    },
    {
      key: 'actions',
      header: '삭제',
      headerClassName: 'text-center',
      className: 'text-center',
      render: (_, row, index) => (
        <button
          type="button"
          onClick={() => removeItem(index)}
          className="text-red-500 hover:text-red-700"
        >
          ✕
        </button>
      )
    }
  ]

  /**
   * 결제 방법 옵션
   */
  const paymentMethodOptions = [
    { value: 'TRANSFER', label: '계좌이체' },
    { value: 'CARD', label: '카드' },
    { value: 'CASH', label: '현금' }
  ]

  /**
   * 통계 계산
   */
  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    shipping: orders.filter(o => o.status === 'SHIPPING').length,
    completed: orders.filter(o => o.status === 'COMPLETED').length
  }), [orders])

  return (
    <>
      <Head>
        <title>주문관리 - SweeTea Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-100">
        <AdminHeader currentPage="orders" />

        <main className="container mx-auto px-4 py-8">
          {/* 페이지 헤더 */}
          <PageHeader
            title="주문관리"
            actionButton={
              <Button variant="primary" onClick={handleAddNew}>
                ➕ 주문 직접 입력
              </Button>
            }
          />

          {/* 통계 카드 그리드 */}
          <StatsGrid columns={4}>
            <StatCard
              title="전체 주문"
              value={stats.total}
              icon="📦"
              bgColor="bg-gray-100"
            />
            <StatCard
              title="대기중"
              value={stats.pending}
              icon="⏳"
              bgColor="bg-yellow-100"
            />
            <StatCard
              title="배송중"
              value={stats.shipping}
              icon="🚚"
              bgColor="bg-blue-100"
            />
            <StatCard
              title="완료"
              value={stats.completed}
              icon="✅"
              bgColor="bg-green-100"
            />
          </StatsGrid>

          {/* 주문 목록 그리드 */}
          {loading ? (
            <LoadingSpinner size="lg" text="주문을 불러오는 중..." />
          ) : (
            <DataGrid
              ref={gridRef}
              rowData={orders}
              columnDefs={columnDefs}
              height={600}
              pageSize={20}
              onCellClicked={onCellClicked}
            />
          )}
        </main>

        {/* 주문 입력 모달 */}
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title="주문 직접 입력"
          maxWidth="max-w-4xl"
        >
          <form onSubmit={handleSubmit}>
            {/* OCR 업로더 */}
            <OCRUploader
              onImageUpload={handleImageUpload}
              isProcessing={ocrProcessing}
              extractedText={ocrText}
              onTextChange={setOcrText}
            />

            {/* 고객 정보 폼 */}
            <CustomerInfoForm
              customerName={customerName}
              onCustomerNameChange={setCustomerName}
              onCustomerNameBlur={handleCustomerNameBlur}
              customerInfo={customerInfo}
              isNewCustomer={isNewCustomer}
              formData={formData}
              onFormDataChange={setFormData}
            />

            {/* 결제 방법 */}
            <FormSelect
              label="결제 방법"
              name="payment_method"
              value={formData.payment_method}
              onChange={(value) => setFormData({ ...formData, payment_method: value })}
              options={paymentMethodOptions}
              className="mb-6"
            />

            {/* 상품 선택 */}
            <OrderItemSelector
              products={products}
              selectedProductId={tempItem.product_id}
              quantity={tempItem.quantity}
              onProductChange={(id) => setTempItem({ ...tempItem, product_id: id })}
              onQuantityChange={(qty) => setTempItem({ ...tempItem, quantity: qty })}
              onAddItem={addItemToOrder}
            />

            {/* 주문 항목 목록 */}
            {formData.items.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-4">주문 항목</h3>
                <DataTable
                  columns={orderItemColumns}
                  data={formData.items}
                />
                <OrderSummary totalAmount={calculateTotal()} />
              </div>
            )}

            {/* 버튼 */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
              >
                주문 등록
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  )
}
