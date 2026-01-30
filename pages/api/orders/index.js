/**
 * 주문 API - Next.js API Routes
 * GET/POST /api/orders
 */

import { orders, products, users } from '../../../lib/fileStore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
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

      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { user_id, items, total_amount, shipping_address, phone, payment_method } = req.body;

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
        payment_method: payment_method || 'CARD',
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
        message: 'Order created successfully',
        order: newOrder
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
