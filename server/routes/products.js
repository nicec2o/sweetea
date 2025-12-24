/**
 * 상품(Product) API 라우트
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
const { pool } = require('../index');
const productQueries = require('../queries/productQueries');

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
    const { category, search } = req.query;
    let query = productQueries.getAllProducts;
    const params = [];

    // 카테고리 필터 적용
    if (category) {
      query = productQueries.getProductsByCategory;
      params.push(category);
    }
    // 검색어 필터 적용
    else if (search) {
      query = productQueries.searchProducts;
      params.push(`%${search}%`, `%${search}%`);
    }
    // 기본 정렬 추가
    else {
      query += ' ORDER BY created_at DESC';
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
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
    const [rows] = await pool.query(productQueries.getProductById, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(rows[0]);
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
 * @body {string} description - 설명 (한국어)
 * @body {string} description_en - 설명 (영어)
 * @body {string} description_ja - 설명 (일본어)
 * @body {number} price - 가격
 * @body {string} category - 카테고리
 * @body {string} image_url - 이미지 URL
 * @body {number} stock - 재고
 * @returns {Object} 생성된 상품 정보
 */
router.post('/', async (req, res) => {
  try {
    const { 
      name, name_en, name_ja, 
      description, description_en, description_ja, 
      price, category, image_url, stock 
    } = req.body;

    // 필수 필드 검증
    if (!name || !price || !category || stock === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [result] = await pool.query(
      productQueries.createProduct,
      [name, name_en, name_ja, description, description_en, description_ja, price, category, image_url, stock]
    );

    res.status(201).json({ 
      id: result.insertId, 
      message: 'Product created successfully' 
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
      name, name_en, name_ja, 
      description, description_en, description_ja, 
      price, category, image_url, stock 
    } = req.body;

    // 필수 필드 검증
    if (!name || !price || !category || stock === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await pool.query(
      productQueries.updateProduct,
      [name, name_en, name_ja, description, description_en, description_ja, price, category, image_url, stock, req.params.id]
    );

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
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
    await pool.query(productQueries.deleteProduct, [req.params.id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
