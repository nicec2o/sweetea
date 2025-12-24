/**
 * 관리자 대시보드 페이지
 * 
 * @description 쇼핑몰 운영 현황을 한눈에 볼 수 있는 대시보드
 * - 통계 카드 (상품/주문/회원/매출)
 * - 최근 주문 목록
 * - 주문 상태별 배지
 */

import { useState, useEffect } from 'react'
import Head from 'next/head'

// 컴포넌트 임포트
import AdminHeader from '../../components/common/AdminHeader'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import StatCard from '../../components/admin/StatCard'
import OrderStatusBadge from '../../components/admin/OrderStatusBadge'

export default function AdminDashboard() {
  // 상태 관리
  const [stats, setStats] = useState(null) // 통계 데이터
  const [loading, setLoading] = useState(true) // 로딩 상태

  /**
   * 컴포넌트 마운트 시 대시보드 데이터 조회
   */
  useEffect(() => {
    fetchDashboardData()
  }, [])

  /**
   * API에서 대시보드 통계 데이터 조회
   */
  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/dashboard')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      alert('대시보드 데이터를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>관리자 대시보드 - SweeTea</title>
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* 헤더 */}
        <AdminHeader currentPage="dashboard" />

        {/* 메인 컨텐츠 */}
        <main className="container mx-auto px-4 py-8">
          {loading ? (
            <LoadingSpinner size="lg" text="데이터를 불러오는 중..." />
          ) : stats ? (
            <>
              {/* 통계 카드 그리드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* 총 상품 수 */}
                <StatCard
                  title="총 상품"
                  value={stats.totalProducts}
                  icon="📦"
                  bgColor="bg-blue-100"
                />

                {/* 총 주문 수 */}
                <StatCard
                  title="총 주문"
                  value={stats.totalOrders}
                  icon="🛒"
                  bgColor="bg-green-100"
                />

                {/* 총 회원 수 */}
                <StatCard
                  title="총 회원"
                  value={stats.totalUsers}
                  icon="👥"
                  bgColor="bg-purple-100"
                />

                {/* 총 매출 */}
                <StatCard
                  title="총 매출"
                  value={`₩${stats.totalRevenue.toLocaleString()}`}
                  icon="💰"
                  bgColor="bg-yellow-100"
                />
              </div>

              {/* 최근 주문 목록 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  최근 주문
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          주문번호
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          고객명
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          이메일
                        </th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">
                          금액
                        </th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">
                          상태
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          주문일시
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map((order) => (
                        <tr 
                          key={order.id} 
                          className="border-b hover:bg-gray-50 transition"
                        >
                          <td className="py-3 px-4 font-medium text-gray-900">
                            #{order.id}
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {order.user_name}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {order.email}
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-900">
                            ₩{order.total_amount.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <OrderStatusBadge status={order.status} />
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(order.created_at).toLocaleString('ko-KR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* 주문이 없을 경우 */}
                  {stats.recentOrders.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      최근 주문이 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">
                데이터를 불러올 수 없습니다.
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
