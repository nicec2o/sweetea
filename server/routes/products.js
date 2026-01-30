/**
 * 상품(Product) API 라우트 - 파일 기반
 * 
 * @description 상품 관리를 위한 RESTful API 엔드포인트
 * - GET /api/products - 상품 목록 조회
 * - GET /api/products/:id - 상품 상세 조회
 * - POST /api/products - 상품 등록
 * - PUT /api/products/:id - 상품 수정
 * - DELETE /api/products/:id - 상품 삭제
 */

const express = require('express');
const router = express.Router();
const { products } = require('../fileStore');

/**
 * GET /api/products
 * 상품 목록 조회
 * 
 * @query {string} category - 카테고리 필터 (선택)
 * @query {string} search - 검색어 (선택)
 * @returns {Array} 상품 목록
 */
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/products - Request received');
    const { category, search } = req.query;
    let result;

    // 카테고리 필터 적용
    if (category) {
      console.log(`Filtering by category: ${category}`);
      result = await products.getByCategory(category);
    }
    // 검색어 필터 적용
    else if (search) {
      console.log(`Searching for: ${search}`);
      result = await products.search(search);
    }
    // 전체 조회
    else {
      console.log('Getting all products');
      result = await products.getAll();
    }

    // 최신순 정렬
    result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    console.log(`Returning ${result.length} products`);
    res.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ error: error.message, details: error.stack });
  }
});

/**
 * GET /api/products/:id
 * 특정 상품 상세 조회
 * 
 * @param {number} id - 상품 ID
 * @returns {Object} 상품 정보
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await products.getById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/products
 * 상품 등록 (관리자 전용)
 * 
 * @body {string} name - 상품명 (한국어)
 * @body {string} name_en - 상품명 (영어)
 * @body {string} name_ja - 상품명 (일본어)
 * @body {string} name_vi - 상품명 (베트남어)
 * @body {string} description - 설명 (한국어)
 * @body {string} description_en - 설명 (영어)
 * @body {string} description_ja - 설명 (일본어)
 * @body {string} description_vi - 설명 (베트남어)
 * @body {number} price - 가격
 * @body {string} category - 카테고리
 * @body {string} image_url - 이미지 URL
 * @body {number} stock - 재고
 * @returns {Object} 생성된 상품 정보
 */
router.post('/', async (req, res) => {
  try {
    const { 
      name, name_en, name_ja, name_vi,
      description, description_en, description_ja, description_vi,
      price, category, image_url, stock 
    } = req.body;

    // 필수 필드 검증
    if (!name || !price || !category || stock === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newProduct = await products.create({
      name, name_en, name_ja, name_vi,
      description, description_en, description_ja, description_vi,
      price: parseFloat(price),
      category,
      image_url: image_url || '',
      stock: parseInt(stock)
    });

    res.status(201).json({ 
      id: newProduct.id, 
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/products/:id
 * 상품 수정 (관리자 전용)
 * 
 * @param {number} id - 상품 ID
 * @body {Object} - 수정할 상품 정보 (POST와 동일)
 * @returns {Object} 성공 메시지
 */
router.put('/:id', async (req, res) => {
  try {
    const { 
      name, name_en, name_ja, name_vi,
      description, description_en, description_ja, description_vi,
      price, category, image_url, stock 
    } = req.body;

    // 필수 필드 검증
    if (!name || !price || !category || stock === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const updatedProduct = await products.update(req.params.id, {
      name, name_en, name_ja, name_vi,
      description, description_en, description_ja, description_vi,
      price: parseFloat(price),
      category,
      image_url: image_url || '',
      stock: parseInt(stock)
    });

    res.json({ 
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    if (error.message === 'Product not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/products/:id
 * 상품 삭제 (관리자 전용)
 * 
 * @param {number} id - 상품 ID
 * @returns {Object} 성공 메시지
 */
router.delete('/:id', async (req, res) => {
  try {
    await products.delete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    if (error.message === 'Product not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
