/**
 * 주문(Order) 관련 SQL 쿼리 모음
 * 
 * @description 주문 및 주문 상세 관리를 위한 모든 쿼리를 정의
 */

module.exports = {
  /**
   * 모든 주문 조회 (사용자 정보 포함)
   * @returns {string} SELECT 쿼리
   */
  getAllOrders: `
    SELECT 
      o.id,
      o.user_id,
      o.total_amount,
      o.status,
      o.shipping_address,
      o.phone,
      o.created_at,
      o.updated_at,
      u.name as user_name,
      u.email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `,

  /**
   * 특정 사용자의 주문 조회
   * @param {number} userId - 사용자 ID
   * @returns {string} SELECT 쿼리
   */
  getOrdersByUser: `
    SELECT 
      o.id,
      o.user_id,
      o.total_amount,
      o.status,
      o.shipping_address,
      o.phone,
      o.created_at,
      o.updated_at,
      u.name as user_name,
      u.email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `,

  /**
   * 특정 주문 상세 조회
   * @param {number} orderId - 주문 ID
   * @returns {string} SELECT 쿼리
   */
  getOrderById: `
    SELECT 
      o.id,
      o.user_id,
      o.total_amount,
      o.status,
      o.shipping_address,
      o.phone,
      o.created_at,
      o.updated_at,
      u.name as user_name,
      u.email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.id = ?
  `,

  /**
   * 주문의 상품 목록 조회
   * @param {number} orderId - 주문 ID
   * @returns {string} SELECT 쿼리
   */
  getOrderItems: `
    SELECT 
      oi.id,
      oi.order_id,
      oi.product_id,
      oi.quantity,
      oi.price,
      p.name,
      p.name_en,
      p.name_ja,
      p.image_url
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `,

  /**
   * 주문 생성
   * @returns {string} INSERT 쿼리
   */
  createOrder: `
    INSERT INTO orders (
      user_id,
      total_amount,
      status,
      shipping_address,
      phone
    ) VALUES (?, ?, ?, ?, ?)
  `,

  /**
   * 주문 상품 추가
   * @returns {string} INSERT 쿼리
   */
  createOrderItem: `
    INSERT INTO order_items (
      order_id,
      product_id,
      quantity,
      price
    ) VALUES (?, ?, ?, ?)
  `,

  /**
   * 주문 상태 변경
   * @param {string} status - 새로운 상태
   * @param {number} orderId - 주문 ID
   * @returns {string} UPDATE 쿼리
   */
  updateOrderStatus: `
    UPDATE orders
    SET status = ?
    WHERE id = ?
  `,

  /**
   * 주문 취소
   * @param {number} orderId - 주문 ID
   * @returns {string} UPDATE 쿼리
   */
  cancelOrder: `
    UPDATE orders
    SET status = 'cancelled'
    WHERE id = ?
  `,

  /**
   * 특정 기간 주문 조회
   * @param {Date} startDate - 시작일
   * @param {Date} endDate - 종료일
   * @returns {string} SELECT 쿼리
   */
  getOrdersByDateRange: `
    SELECT 
      o.id,
      o.user_id,
      o.total_amount,
      o.status,
      o.shipping_address,
      o.phone,
      o.created_at,
      o.updated_at,
      u.name as user_name,
      u.email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE DATE(o.created_at) BETWEEN ? AND ?
    ORDER BY o.created_at DESC
  `,

  /**
   * 특정 날짜의 주문 조회
   * @param {Date} date - 조회할 날짜
   * @returns {string} SELECT 쿼리
   */
  getOrdersByDate: `
    SELECT 
      o.id,
      o.user_id,
      o.total_amount,
      o.status,
      o.shipping_address,
      o.phone,
      o.created_at,
      o.updated_at,
      u.name as user_name,
      u.email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE DATE(o.created_at) = ?
    ORDER BY o.created_at DESC
  `,

  /**
   * 주문 상태별 조회
   * @param {string} status - 주문 상태
   * @returns {string} SELECT 쿼리
   */
  getOrdersByStatus: `
    SELECT 
      o.id,
      o.user_id,
      o.total_amount,
      o.status,
      o.shipping_address,
      o.phone,
      o.created_at,
      o.updated_at,
      u.name as user_name,
      u.email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.status = ?
    ORDER BY o.created_at DESC
  `
}
