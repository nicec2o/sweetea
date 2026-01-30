/**
 * 개별 주문 API - Next.js API Routes
 * GET/PUT/DELETE /api/orders/[id]
 */

import { orders, products } from '../../../lib/fileStore';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const order = await orders.getById(id);
      
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

      res.status(200).json({ 
        ...order, 
        items: itemsWithDetails 
      });
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const order = await orders.getById(id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const updatedOrder = await orders.update(id, {
        ...order,
        ...req.body
      });

      res.status(200).json({ 
        message: 'Order updated successfully',
        order: updatedOrder
      });
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      await orders.delete(id);
      res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
      console.error('Error deleting order:', error);
      if (error.message === 'Order not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
