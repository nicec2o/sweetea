import { useState, useEffect, useRef, useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { AgGridReact } from 'ag-grid-react'
import Calendar from 'react-calendar'

export default function AdminOrders() {
  const gridRef = useRef()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showCalendar, setShowCalendar] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/orders')
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3001/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        fetchOrders()
        alert('주문 상태가 변경되었습니다.')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('오류가 발생했습니다.')
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      shipping: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return badges[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status) => {
    const texts = {
      pending: '주문접수',
      confirmed: '주문확인',
      preparing: '준비중',
      shipping: '배송중',
      completed: '배송완료',
      cancelled: '취소',
    }
    return texts[status] || status
  }

  const columnDefs = useMemo(() => [
    { field: 'id', headerName: '주문번호', width: 100, sortable: true, filter: true },
    { field: 'user_name', headerName: '고객명', width: 150, sortable: true, filter: true },
    { field: 'email', headerName: '이메일', width: 200, sortable: true, filter: true },
    { 
      field: 'total_amount', 
      headerName: '주문금액', 
      width: 130, 
      sortable: true,
      valueFormatter: params => `₩${params.value.toLocaleString()}`
    },
    {
      field: 'status',
      headerName: '주문상태',
      width: 150,
      cellRenderer: (params) => {
        return (
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(params.value)}`}>
            {getStatusText(params.value)}
          </span>
        )
      }
    },
    { field: 'phone', headerName: '연락처', width: 150 },
    { 
      field: 'created_at', 
      headerName: '주문일시', 
      width: 180,
      valueFormatter: params => new Date(params.value).toLocaleString()
    },
    {
      field: 'actions',
      headerName: '상태변경',
      width: 200,
      cellRenderer: (params) => {
        return (
          <select
            value={params.data.status}
            onChange={(e) => handleStatusChange(params.data.id, e.target.value)}
            className="px-2 py-1 border rounded text-sm"
          >
            <option value="pending">주문접수</option>
            <option value="confirmed">주문확인</option>
            <option value="preparing">준비중</option>
            <option value="shipping">배송중</option>
            <option value="completed">배송완료</option>
            <option value="cancelled">취소</option>
          </select>
        )
      }
    }
  ], [])

  const defaultColDef = useMemo(() => ({
    resizable: true,
  }), [])

  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.created_at)
    return orderDate.toDateString() === selectedDate.toDateString()
  })

  return (
    <>
      <Head>
        <title>주문관리 - SweeTea Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">주문관리</h1>
              <div className="flex gap-4">
                <Link href="/admin" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                  대시보드
                </Link>
                <Link href="/admin/products" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                  상품관리
                </Link>
                <Link href="/admin/orders" className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calendar Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">날짜 선택</h2>
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  locale="ko-KR"
                  className="w-full"
                />
                <div className="mt-4 text-sm text-gray-600">
                  <p className="font-semibold">선택된 날짜:</p>
                  <p>{selectedDate.toLocaleDateString()}</p>
                  <p className="mt-2">해당 날짜 주문: {filteredOrders.length}건</p>
                </div>
              </div>
            </div>

            {/* Orders Grid */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    전체 주문 목록 ({orders.length}건)
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowCalendar(!showCalendar)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      {showCalendar ? '전체 보기' : '날짜별 보기'}
                    </button>
                  </div>
                </div>

                <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
                  <AgGridReact
                    ref={gridRef}
                    rowData={showCalendar ? filteredOrders : orders}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    paginationPageSize={20}
                    animateRows={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
