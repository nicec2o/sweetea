/**
 * 관리자(Admin) 통계 관련 SQL 쿼리 모음
 * 
 * @description 대시보드 및 리포트를 위한 통계 쿼리를 정의
 */

module.exports = {
  /**
   * 총 상품 수
   * @returns {string} SELECT 쿼리
   */
  getTotalProducts: `
    SELECT COUNT(*) as count
    FROM products
  `,

  /**
   * 총 주문 수
   * @returns {string} SELECT 쿼리
   */
  getTotalOrders: `
    SELECT COUNT(*) as count
    FROM orders
  `,

  /**
   * 총 일반 사용자 수
   * @returns {string} SELECT 쿼리
   */
  getTotalUsers: `
    SELECT COUNT(*) as count
    FROM users
    WHERE role = 'user'
  `,

  /**
   * 총 매출 (완료된 주문만)
   * @returns {string} SELECT 쿼리
   */
  getTotalRevenue: `
    SELECT SUM(total_amount) as total
    FROM orders
    WHERE status = 'completed'
  `,

  /**
   * 최근 주문 목록 (10개)
   * @returns {string} SELECT 쿼리
   */
  getRecentOrders: `
    SELECT 
      o.id,
      o.user_id,
      o.total_amount,
      o.status,
      o.created_at,
      u.name as user_name,
      u.email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
    LIMIT 10
  `,

  /**
   * 월별 매출 통계 (최근 12개월)
   * @returns {string} SELECT 쿼리
   */
  getMonthlySalesStats: `
    SELECT 
      DATE_FORMAT(created_at, '%Y-%m') as month,
      COUNT(*) as order_count,
      SUM(total_amount) as total_amount
    FROM orders
    WHERE status = 'completed'
      AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
    GROUP BY DATE_FORMAT(created_at, '%Y-%m')
    ORDER BY month DESC
  `,

  /**
   * 일별 매출 통계 (최근 30일)
   * @returns {string} SELECT 쿼리
   */
  getDailySalesStats: `
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as order_count,
      SUM(total_amount) as total_amount
    FROM orders
    WHERE status = 'completed'
      AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY DATE(created_at)
    ORDER BY date DESC
  `,

  /**
   * 인기 상품 TOP 10
   * @returns {string} SELECT 쿼리
   */
  getPopularProducts: `
    SELECT 
      p.id,
      p.name,
      p.name_en,
      p.name_ja,
      p.image_url,
      p.price,
      SUM(oi.quantity) as total_sold,
      SUM(oi.quantity * oi.price) as total_revenue
    FROM products p
    JOIN order_items oi ON p.id = oi.product_id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.status = 'completed'
    GROUP BY p.id
    ORDER BY total_sold DESC
    LIMIT 10
  `,

  /**
   * 카테고리별 매출 통계
   * @returns {string} SELECT �kery
   */
  getSalesByCategory: `
    SELECT 
      p.category,
      COUNT(DISTINCT o.id) as order_count,
      SUM(oi.quantity) as total_quantity,
      SUM(oi.quantity * oi.price) as total_revenue
    FROM products p
    JOIN order_items oi ON p.id = oi.product_id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.status = 'completed'
    GROUP BY p.category
    ORDER BY total_revenue DESC
  `,

  /**
   * 주문 상태별 통계
   * @returns {string} SELECT 쿼리
   */
  getOrderStatusStats: `
    SELECT 
      status,
      COUNT(*) as count,
      SUM(total_amount) as total_amount
    FROM orders
    GROUP BY status
    ORDER BY 
      CASE status
        WHEN 'pending' THEN 1
        WHEN 'confirmed' THEN 2
        WHEN 'preparing' THEN 3
        WHEN 'shipping' THEN 4
        WHEN 'completed' THEN 5
        WHEN 'cancelled' THEN 6
      END
  `,

  /**
   * 재고 부족 상품 (재고 10개 이하)
   * @returns {string} SELECT 쿼리
   */
  getLowStockProducts: `
    SELECT 
      id,
      name,
      name_en,
      name_ja,
      category,
      stock,
      price
    FROM products
    WHERE stock <= 10
    ORDER BY stock ASC
  `,

  /**
   * 특정 기간 매출 통계
   * @param {Date} startDate - 시작일
   * @param {Date} endDate - 종료일
   * @returns {string} SELECT 쿼리
   */
  getSalesByDateRange: `
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as order_count,
      SUM(total_amount) as total_amount
    FROM orders
    WHERE status = 'completed'
      AND DATE(created_at) BETWEEN ? AND ?
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `,

  /**
   * 고객별 구매 통계 TOP 10
   * @returns {string} SELECT 쿼리
   */
  getTopCustomers: `
    SELECT 
      u.id,
      u.name,
      u.email,
      COUNT(o.id) as order_count,
      SUM(o.total_amount) as total_spent
    FROM users u
    JOIN orders o ON u.id = o.user_id
    WHERE o.status = 'completed'
    GROUP BY u.id
    ORDER BY total_spent DESC
    LIMIT 10
  `,

  /**
   * 평균 주문 금액
   * @returns {string} SELECT 쿼리
   */
  getAverageOrderAmount: `
    SELECT AVG(total_amount) as average
    FROM orders
    WHERE status = 'completed'
  `,

  /**
   * 오늘의 통계
   * @returns {string} SELECT 쿼리
   */
  getTodayStats: `
    SELECT 
      COUNT(*) as order_count,
      SUM(total_amount) as total_amount,
      AVG(total_amount) as average_amount
    FROM orders
    WHERE DATE(created_at) = CURDATE()
  `
}
