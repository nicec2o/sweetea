import { orders, products, users } from '../../../lib/fileStore';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const [allOrders, allProducts, allUsers] = await Promise.all([
      orders.getAll(),
      products.getAll(),
      users.getAll()
    ]);
    
    const ordersWithUsers = allOrders.map(order => {
      const user = allUsers.find(u => u.id === order.user_id);
      return {
        ...order,
        user_name: user?.name || 'Unknown',
        email: user?.email || 'N/A'
      };
    });
    
    const recentOrders = ordersWithUsers
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
    
    const totalRevenue = allOrders.reduce((sum, order) => {
      if (order.status === 'CANCELLED') return sum;
      return sum + (order.total_amount || 0);
    }, 0);
    
    res.status(200).json({
      totalProducts: allProducts.length,
      totalOrders: allOrders.length,
      totalUsers: allUsers.length,
      totalRevenue,
      recentOrders
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    res.status(500).json({ error: error.message });
  }
}
