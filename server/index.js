/**
 * Express 서버 - 파일 기반 저장소 사용
 * 
 * @description MySQL 대신 JSON 파일로 데이터를 관리하는 Express 서버
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// 라우트
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const commonCodeRoutes = require('./routes/commonCodes');
const adminRoutes = require('./routes/admin');

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/common-codes', commonCodeRoutes);
app.use('/api/admin', adminRoutes);

// 헬스체크
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    storage: 'file-based'
  });
});

// 데이터 디렉토리 확인
app.get('/api/storage-test', async (req, res) => {
  try {
    const { products } = require('./fileStore');
    const allProducts = await products.getAll();
    res.json({ 
      status: 'connected', 
      storage: 'file-based',
      productsCount: allProducts.length
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Storage: File-based (JSON)`);
  console.log(`Data directory: ${path.join(__dirname, 'data')}`);
  
  // 시작 시 데이터 파일 확인
  try {
    const { products } = require('./fileStore');
    const allProducts = await products.getAll();
    console.log(`\u2705 Loaded ${allProducts.length} products successfully`);
  } catch (error) {
    console.error('\u274c Error loading products:', error.message);
  }
});

module.exports = app;
