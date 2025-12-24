/**
 * 사용자(User) 관련 SQL 쿼리 모음
 * 
 * @description 사용자 인증 및 관리를 위한 모든 쿼리를 정의
 */

module.exports = {
  /**
   * 모든 사용자 조회 (비밀번호 제외)
   * @returns {string} SELECT 쿼리
   */
  getAllUsers: `
    SELECT 
      id,
      email,
      name,
      phone,
      role,
      created_at,
      updated_at
    FROM users
    ORDER BY created_at DESC
  `,

  /**
   * 특정 사용자 조회 (비밀번호 제외)
   * @param {number} id - 사용자 ID
   * @returns {string} SELECT 쿼리
   */
  getUserById: `
    SELECT 
      id,
      email,
      name,
      phone,
      role,
      created_at,
      updated_at
    FROM users
    WHERE id = ?
  `,

  /**
   * 이메일로 사용자 조회 (로그인용, 비밀번호 포함)
   * @param {string} email - 이메일
   * @returns {string} SELECT 쿼리
   */
  getUserByEmail: `
    SELECT 
      id,
      email,
      password,
      name,
      phone,
      role,
      created_at,
      updated_at
    FROM users
    WHERE email = ?
  `,

  /**
   * 이메일 중복 확인
   * @param {string} email - 이메일
   * @returns {string} SELECT 쿼리
   */
  checkEmailExists: `
    SELECT id
    FROM users
    WHERE email = ?
  `,

  /**
   * 회원가입
   * @returns {string} INSERT 쿼리
   */
  createUser: `
    INSERT INTO users (
      email,
      password,
      name,
      phone,
      role
    ) VALUES (?, ?, ?, ?, ?)
  `,

  /**
   * 사용자 정보 수정
   * @returns {string} UPDATE 쿼리
   */
  updateUser: `
    UPDATE users
    SET 
      name = ?,
      phone = ?
    WHERE id = ?
  `,

  /**
   * 비밀번호 변경
   * @returns {string} UPDATE 쿼리
   */
  updatePassword: `
    UPDATE users
    SET password = ?
    WHERE id = ?
  `,

  /**
   * 사용자 역할 변경 (관리자용)
   * @param {string} role - 새로운 역할 (user, admin)
   * @param {number} id - 사용자 ID
   * @returns {string} UPDATE 쿼리
   */
  updateUserRole: `
    UPDATE users
    SET role = ?
    WHERE id = ?
  `,

  /**
   * 사용자 삭제
   * @param {number} id - 사용자 ID
   * @returns {string} DELETE 쿼리
   */
  deleteUser: `
    DELETE FROM users
    WHERE id = ?
  `,

  /**
   * 역할별 사용자 수 조회
   * @returns {string} SELECT 쿼리
   */
  getUserCountByRole: `
    SELECT 
      role,
      COUNT(*) as count
    FROM users
    GROUP BY role
  `,

  /**
   * 일반 사용자만 조회
   * @returns {string} SELECT 쿼리
   */
  getRegularUsers: `
    SELECT 
      id,
      email,
      name,
      phone,
      role,
      created_at,
      updated_at
    FROM users
    WHERE role = 'user'
    ORDER BY created_at DESC
  `,

  /**
   * 관리자만 조회
   * @returns {string} SELECT 쿼리
   */
  getAdminUsers: `
    SELECT 
      id,
      email,
      name,
      phone,
      role,
      created_at,
      updated_at
    FROM users
    WHERE role = 'admin'
    ORDER BY created_at DESC
  `
}
