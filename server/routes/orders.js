/**
 * 주문(Order) API 라우트 - 파일 기반
 * 
 * @description 주문 관리를 위한 RESTful API 엔드포인트
 */

const express = require('express');
const router = express.Router();
const { orders, products, users } = require('../fileStore');

/**
 * GET /api/orders
 * 주문 목록 조회
 */
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    let result = await orders.getAll();

    // 사용자별 필터링
    if (user_id) {
      result = result.filter(order => order.user_id === parseInt(user_id));
    }

    // 사용자 정보 추가
    const allUsers = await users.getAll();
    result = result.map(order => {
      const user = allUsers.find(u => u.id === order.user_id);
      return {
        ...order,
        email: user?.email,
        user_name: user?.name
      };
    });

    // 최신순 정렬
    result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json(result);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/orders/:id
 * 주문 상세 조회
 */
router.get('/:id', async (req, res) => {
  try {
    const order = await orders.getById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // 주문 상품 정보에 상품 상세 정보 추가
    const allProducts = await products.getAll();
    const itemsWithDetails = order.items.map(item => {
      const product = allProducts.find(p => p.id === item.product_id);
      return {
        ...item,
        name: product?.name,
        name_en: product?.name_en,
        name_ja: product?.name_ja,
        name_vi: product?.name_vi,
        image_url: product?.image_url
      };
    });

    res.json({ 
      ...order, 
      items: itemsWithDetails 
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/orders
 * 주문 생성
 */
router.post('/', async (req, res) => {
  try {
    const { user_id, items, total_amount, shipping_address, phone } = req.body;

    // 필수 필드 검증
    if (!user_id || !items || !items.length || !total_amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 재고 확인 및 차감
    const allProducts = await products.getAll();
    for (const item of items) {
      const product = allProducts.find(p => p.id === item.product_id);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.product_id} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for product ${product.name}` 
        });
      }
    }

    // 주문 생성
    const newOrder = await orders.create({
      user_id: parseInt(user_id),
      total_amount: parseFloat(total_amount),
      status: 'PENDING',
      shipping_address: shipping_address || '',
      phone: phone || '',
      items: items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }))
    });

    // 재고 차감
    for (const item of items) {
      const product = allProducts.find(p => p.id === item.product_id);
      await products.update(item.product_id, {
        ...product,
        stock: product.stock - item.quantity
      });
    }

    res.status(201).json({ 
      id: newOrder.id, 
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/orders/:id/status
 * 주문 상태 업데이트
 */
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const order = await orders.getById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await orders.update(req.params.id, {
      ...order,
      status
    });

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/orders/:id
 * 주문 삭제
 */
router.delete('/:id', async (req, res) => {
  try {
    await orders.delete(req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    if (error.message === 'Order not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
