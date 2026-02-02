/**
 * 관리자 대시보드 페이지
 * 
 * @description 쇼핑몰 운영 현황을 한눈에 볼 수 있는 대시보드
 * - 통계 카드 (상품/주문/회원/매출)
 * - 최근 주문 목록 (DataTable 사용)
 * - 주문 상태별 배지
 */

import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { LoadingSpinner, DataTable, StatsGrid } from '../../components/ui'
import OrderStatusBadge from '../../components/admin/OrderStatusBadge'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      alert('대시보드 데이터를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const orderColumns = [
    {
      key: 'id',
      header: '주문번호',
      render: (value) => <span className="font-medium text-gray-900">#{value}</span>
    },
    {
      key: 'user_name',
      header: '고객명',
      className: 'text-gray-700'
    },
    {
      key: 'email',
      header: '이메일',
      className: 'text-gray-600'
    },
    {
      key: 'total_amount',
      header: '금액',
      headerClassName: 'text-right',
      className: 'text-right font-semibold text-gray-900',
      render: (value) => `₩${value.toLocaleString()}`
    },
    {
      key: 'status',
      header: '상태',
      headerClassName: 'text-center',
      className: 'text-center',
      render: (value) => <OrderStatusBadge status={value} />
    },
    {
      key: 'created_at',
      header: '주문일시',
      className: 'text-gray-600',
      render: (value) => new Date(value).toLocaleString('ko-KR')
    }
  ]

  const dashboardStats = stats ? [
    {
      title: '총 상품',
      value: stats.totalProducts,
      icon: '📦',
      iconBg: 'bg-blue-500'
    },
    {
      title: '총 주문',
      value: stats.totalOrders,
      icon: '🛒',
      iconBg: 'bg-green-500'
    },
    {
      title: '총 회원',
      value: stats.totalUsers,
      icon: '👥',
      iconBg: 'bg-purple-500'
    },
    {
      title: '총 매출',
      value: `₩${stats.totalRevenue.toLocaleString()}`,
      icon: '💰',
      iconBg: 'bg-yellow-500'
    }
  ] : []

  return (
    <AdminLayout title="관리자 대시보드 - SweeTea">
      {loading ? (
        <LoadingSpinner size="lg" message="데이터를 불러오는 중..." />
      ) : stats ? (
        <>
          <StatsGrid stats={dashboardStats} columns={4} className="mb-8" />

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              최근 주문
            </h2>
            
            <DataTable
              columns={orderColumns}
              data={stats.recentOrders}
              emptyMessage="최근 주문이 없습니다."
            />
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">
            데이터를 불러올 수 없습니다.
          </p>
        </div>
      )}
    </AdminLayout>
  )
}
