const express = require('express');
const router = express.Router();
const { pool } = require('../index');

// 주문 목록 조회
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    let query = `
      SELECT o.*, u.email, u.name as user_name 
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      WHERE 1=1
    `;
    const params = [];

    if (user_id) {
      query += ' AND o.user_id = ?';
      params.push(user_id);
    }

    query += ' ORDER BY o.created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 주문 상세 조회
router.get('/:id', async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const [items] = await pool.query(`
      SELECT oi.*, p.name, p.name_en, p.name_ja, p.image_url 
      FROM order_items oi 
      JOIN products p ON oi.product_id = p.id 
      WHERE oi.order_id = ?
    `, [req.params.id]);

    res.json({ ...orders[0], items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 주문 생성
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { user_id, items, total_amount, shipping_address, phone } = req.body;

    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_amount, status, shipping_address, phone) VALUES (?, ?, ?, ?, ?)',
      [user_id, total_amount, 'pending', shipping_address, phone]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );

      await connection.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    await connection.commit();
    res.status(201).json({ id: orderId, message: 'Order created successfully' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

// 주문 상태 업데이트
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
