/**
 * 관리자(Admin) API 라우트 - 파일 기반
 * 
 * @description 관리자용 통계 및 관리 API 엔드포인트
 */

const express = require('express');
const router = express.Router();
const { products, orders, users } = require('../fileStore');

/**
 * GET /api/admin/dashboard
 * 대시보드 통계
 */
router.get('/dashboard', async (req, res) => {
  try {
    const allProducts = await products.getAll();
    const allOrders = await orders.getAll();
    const allUsers = await users.getAll();

    // 총 매출 계산
    const totalRevenue = allOrders
      .filter(o => o.status === 'COMPLETED')
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);

    // 최근 주문 10개 (사용자 정보 포함)
    const recentOrders = allOrders
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10)
      .map(order => {
        const user = allUsers.find(u => u.id === order.user_id);
        return {
          ...order,
          user_name: user?.name,
          email: user?.email
        };
      });

    res.json({
      totalProducts: allProducts.length,
      totalOrders: allOrders.length,
      totalUsers: allUsers.filter(u => u.role !== 'ADMIN').length,
      totalRevenue,
      recentOrders
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/admin/sales-stats
 * 월별 매출 통계
 */
router.get('/sales-stats', async (req, res) => {
  try {
    const allOrders = await orders.getAll();
    
    // 완료된 주문만 필터링
    const completedOrders = allOrders.filter(o => o.status === 'COMPLETED');

    // 월별로 그룹화
    const monthlyStats = {};
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 12, 1);

    completedOrders.forEach(order => {
      const orderDate = new Date(order.created_at);
      if (orderDate >= twelveMonthsAgo) {
        const month = orderDate.toISOString().substring(0, 7); // YYYY-MM
        
        if (!monthlyStats[month]) {
          monthlyStats[month] = {
            month,
            order_count: 0,
            total_amount: 0
          };
        }
        
        monthlyStats[month].order_count++;
        monthlyStats[month].total_amount += order.total_amount || 0;
      }
    });

    // 배열로 변환하고 정렬
    const result = Object.values(monthlyStats)
      .sort((a, b) => b.month.localeCompare(a.month));

    res.json(result);
  } catch (error) {
    console.error('Error fetching sales stats:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/admin/popular-products
 * 인기 상품 통계
 */
router.get('/popular-products', async (req, res) => {
  try {
    const allOrders = await orders.getAll();
    const allProducts = await products.getAll();

    // 완료된 주문만 필터링
    const completedOrders = allOrders.filter(o => o.status === 'COMPLETED');

    // 상품별 판매 통계
    const productStats = {};

    completedOrders.forEach(order => {
      if (order.items) {
        order.items.forEach(item => {
          if (!productStats[item.product_id]) {
            productStats[item.product_id] = {
              product_id: item.product_id,
              total_sold: 0,
              total_revenue: 0
            };
          }

          productStats[item.product_id].total_sold += item.quantity;
          productStats[item.product_id].total_revenue += item.quantity * item.price;
        });
      }
    });

    // 상품 정보 추가
    const result = Object.values(productStats)
      .map(stat => {
        const product = allProducts.find(p => p.id === stat.product_id);
        return {
          id: stat.product_id,
          name: product?.name,
          name_en: product?.name_en,
          name_ja: product?.name_ja,
          name_vi: product?.name_vi,
          image_url: product?.image_url,
          total_sold: stat.total_sold,
          total_revenue: stat.total_revenue
        };
      })
      .sort((a, b) => b.total_sold - a.total_sold)
      .slice(0, 10);

    res.json(result);
  } catch (error) {
    console.error('Error fetching popular products:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/admin/users
 * 사용자 목록 조회
 */
router.get('/users', async (req, res) => {
  try {
    const allUsers = await users.getAll();
    
    // 비밀번호 제거하고 최신순 정렬
    const safeUsers = allUsers
      .map(({ password, ...user }) => user)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json(safeUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/admin/users/:id/role
 * 사용자 역할 변경
 */
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }

    const user = await users.getById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await users.update(req.params.id, {
      ...user,
      role
    });

    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
