const express = require('express');
const router = express.Router();
const { pool } = require('../index');

// 대시보드 통계
router.get('/dashboard', async (req, res) => {
  try {
    const [totalProducts] = await pool.query('SELECT COUNT(*) as count FROM products');
    const [totalOrders] = await pool.query('SELECT COUNT(*) as count FROM orders');
    const [totalUsers] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = "user"');
    const [totalRevenue] = await pool.query('SELECT SUM(total_amount) as total FROM orders WHERE status = "completed"');
    
    const [recentOrders] = await pool.query(`
      SELECT o.*, u.name as user_name, u.email 
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC 
      LIMIT 10
    `);

    res.json({
      totalProducts: totalProducts[0].count,
      totalOrders: totalOrders[0].count,
      totalUsers: totalUsers[0].count,
      totalRevenue: totalRevenue[0].total || 0,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 월별 매출 통계
router.get('/sales-stats', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as order_count,
        SUM(total_amount) as total_amount
      FROM orders
      WHERE status = 'completed'
        AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 인기 상품 통계
router.get('/popular-products', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.name_en,
        p.name_ja,
        p.image_url,
        SUM(oi.quantity) as total_sold,
        SUM(oi.quantity * oi.price) as total_revenue
      FROM products p
      JOIN order_items oi ON p.id = oi.product_id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status = 'completed'
      GROUP BY p.id
      ORDER BY total_sold DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 사용자 목록 조회
router.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, email, name, phone, role, created_at 
      FROM users 
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 사용자 역할 변경
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
