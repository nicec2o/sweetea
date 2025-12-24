/**
 * 상품(Product) 관련 SQL 쿼리 모음
 * 
 * @description 상품 관리를 위한 모든 쿼리를 정의
 */

module.exports = {
  /**
   * 모든 상품 조회
   * @returns {string} SELECT 쿼리
   */
  getAllProducts: `
    SELECT 
      id,
      name,
      name_en,
      name_ja,
      description,
      description_en,
      description_ja,
      price,
      category,
      image_url,
      stock,
      created_at,
      updated_at
    FROM products
    WHERE 1=1
  `,

  /**
   * 카테고리별 상품 조회
   * @param {string} category - 카테고리 코드
   * @returns {string} SELECT 쿼리
   */
  getProductsByCategory: `
    SELECT 
      id,
      name,
      name_en,
      name_ja,
      description,
      description_en,
      description_ja,
      price,
      category,
      image_url,
      stock,
      created_at,
      updated_at
    FROM products
    WHERE category = ?
    ORDER BY created_at DESC
  `,

  /**
   * 검색어로 상품 조회
   * @param {string} search - 검색어
   * @returns {string} SELECT 쿼리
   */
  searchProducts: `
    SELECT 
      id,
      name,
      name_en,
      name_ja,
      description,
      description_en,
      description_ja,
      price,
      category,
      image_url,
      stock,
      created_at,
      updated_at
    FROM products
    WHERE (name LIKE ? OR description LIKE ?)
    ORDER BY created_at DESC
  `,

  /**
   * 특정 상품 조회 (ID)
   * @param {number} id - 상품 ID
   * @returns {string} SELECT 쿼리
   */
  getProductById: `
    SELECT 
      id,
      name,
      name_en,
      name_ja,
      description,
      description_en,
      description_ja,
      price,
      category,
      image_url,
      stock,
      created_at,
      updated_at
    FROM products
    WHERE id = ?
  `,

  /**
   * 상품 등록
   * @returns {string} INSERT 쿼리
   */
  createProduct: `
    INSERT INTO products (
      name,
      name_en,
      name_ja,
      description,
      description_en,
      description_ja,
      price,
      category,
      image_url,
      stock
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,

  /**
   * 상품 수정
   * @returns {string} UPDATE 쿼리
   */
  updateProduct: `
    UPDATE products
    SET 
      name = ?,
      name_en = ?,
      name_ja = ?,
      description = ?,
      description_en = ?,
      description_ja = ?,
      price = ?,
      category = ?,
      image_url = ?,
      stock = ?
    WHERE id = ?
  `,

  /**
   * 상품 삭제
   * @param {number} id - 상품 ID
   * @returns {string} DELETE 쿼리
   */
  deleteProduct: `
    DELETE FROM products
    WHERE id = ?
  `,

  /**
   * 재고 감소 (주문 시)
   * @param {number} quantity - 감소할 수량
   * @param {number} productId - 상품 ID
   * @returns {string} UPDATE 쿼리
   */
  decreaseStock: `
    UPDATE products
    SET stock = stock - ?
    WHERE id = ?
  `,

  /**
   * 재고 증가 (주문 취소 시)
   * @param {number} quantity - 증가할 수량
   * @param {number} productId - 상품 ID
   * @returns {string} UPDATE 쿼리
   */
  increaseStock: `
    UPDATE products
    SET stock = stock + ?
    WHERE id = ?
  `
}
