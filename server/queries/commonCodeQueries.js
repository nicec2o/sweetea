/**
 * 공통코드(Common Code) 관련 SQL 쿼리 모음
 * 
 * @description 공통코드 관리를 위한 모든 쿼리를 정의
 */

module.exports = {
  /**
   * 모든 공통코드 조회
   * @returns {string} SELECT 쿼리
   */
  getAllCodes: `
    SELECT 
      id,
      code_group,
      code,
      code_name,
      code_name_en,
      code_name_ja,
      sort_order,
      use_yn,
      created_at,
      updated_at
    FROM common_codes
    ORDER BY code_group, sort_order
  `,

  /**
   * 사용중인 공통코드만 조회
   * @returns {string} SELECT 쿼리
   */
  getActiveCodes: `
    SELECT 
      id,
      code_group,
      code,
      code_name,
      code_name_en,
      code_name_ja,
      sort_order,
      use_yn,
      created_at,
      updated_at
    FROM common_codes
    WHERE use_yn = 'Y'
    ORDER BY code_group, sort_order
  `,

  /**
   * 코드 그룹 목록 조회
   * @returns {string} SELECT 쿼리
   */
  getCodeGroups: `
    SELECT DISTINCT code_group
    FROM common_codes
    ORDER BY code_group
  `,

  /**
   * 특정 그룹의 공통코드 조회
   * @param {string} codeGroup - 코드 그룹
   * @returns {string} SELECT 쿼리
   */
  getCodesByGroup: `
    SELECT 
      id,
      code_group,
      code,
      code_name,
      code_name_en,
      code_name_ja,
      sort_order,
      use_yn,
      created_at,
      updated_at
    FROM common_codes
    WHERE code_group = ?
    ORDER BY sort_order
  `,

  /**
   * 특정 그룹의 사용중인 코드만 조회
   * @param {string} codeGroup - 코드 그룹
   * @returns {string} SELECT 쿼리
   */
  getActiveCodesByGroup: `
    SELECT 
      id,
      code_group,
      code,
      code_name,
      code_name_en,
      code_name_ja,
      sort_order,
      use_yn,
      created_at,
      updated_at
    FROM common_codes
    WHERE code_group = ? AND use_yn = 'Y'
    ORDER BY sort_order
  `,

  /**
   * 특정 코드 조회
   * @param {string} codeGroup - 코드 그룹
   * @param {string} code - 코드
   * @returns {string} SELECT 쿼리
   */
  getCodeByGroupAndCode: `
    SELECT 
      id,
      code_group,
      code,
      code_name,
      code_name_en,
      code_name_ja,
      sort_order,
      use_yn,
      created_at,
      updated_at
    FROM common_codes
    WHERE code_group = ? AND code = ?
  `,

  /**
   * 코드 ID로 조회
   * @param {number} id - 코드 ID
   * @returns {string} SELECT 쿼리
   */
  getCodeById: `
    SELECT 
      id,
      code_group,
      code,
      code_name,
      code_name_en,
      code_name_ja,
      sort_order,
      use_yn,
      created_at,
      updated_at
    FROM common_codes
    WHERE id = ?
  `,

  /**
   * 공통코드 등록
   * @returns {string} INSERT 쿼리
   */
  createCode: `
    INSERT INTO common_codes (
      code_group,
      code,
      code_name,
      code_name_en,
      code_name_ja,
      sort_order,
      use_yn
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `,

  /**
   * 공통코드 수정
   * @returns {string} UPDATE 쿼리
   */
  updateCode: `
    UPDATE common_codes
    SET 
      code_group = ?,
      code = ?,
      code_name = ?,
      code_name_en = ?,
      code_name_ja = ?,
      sort_order = ?,
      use_yn = ?
    WHERE id = ?
  `,

  /**
   * 공통코드 삭제
   * @param {number} id - 코드 ID
   * @returns {string} DELETE 쿼리
   */
  deleteCode: `
    DELETE FROM common_codes
    WHERE id = ?
  `,

  /**
   * 코드 사용 여부 변경
   * @param {string} useYn - 사용 여부 (Y/N)
   * @param {number} id - 코드 ID
   * @returns {string} UPDATE 쿼리
   */
  updateCodeStatus: `
    UPDATE common_codes
    SET use_yn = ?
    WHERE id = ?
  `,

  /**
   * 코드 중복 확인
   * @param {string} codeGroup - 코드 그룹
   * @param {string} code - 코드
   * @returns {string} SELECT 쿼리
   */
  checkCodeExists: `
    SELECT id
    FROM common_codes
    WHERE code_group = ? AND code = ?
  `
}
