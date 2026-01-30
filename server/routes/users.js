/**
 * 사용자(User) API 라우트 - 파일 기반
 * 
 * @description 사용자 관리를 위한 RESTful API 엔드포인트
 */

const express = require('express');
const router = express.Router();
const { users } = require('../fileStore');

/**
 * GET /api/users
 * 사용자 목록 조회
 */
router.get('/', async (req, res) => {
  try {
    const result = await users.getAll();
    // 비밀번호 제거
    const safeUsers = result.map(({ password, ...user }) => user);
    res.json(safeUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/users/:id
 * 사용자 상세 조회
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await users.getById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 비밀번호 제거
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/users/register
 * 사용자 등록
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // 필수 필드 검증
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 이메일 중복 확인
    const existingUser = await users.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // 사용자 생성
    const newUser = await users.create({
      email,
      password, // 실제로는 해시화 필요
      name,
      phone: phone || '',
      role: 'USER'
    });

    // 비밀번호 제거하고 반환
    const { password: _, ...safeUser } = newUser;
    res.status(201).json({ 
      message: 'User registered successfully',
      user: safeUser
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/users/login
 * 사용자 로그인
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await users.getByEmail(email);
    
    if (!user || user.password !== password) { // 실제로는 해시 비교 필요
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 비밀번호 제거하고 반환
    const { password: _, ...safeUser } = user;
    res.json({ 
      message: 'Login successful',
      user: safeUser
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/users/:id
 * 사용자 정보 수정
 */
router.put('/:id', async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    
    const user = await users.getById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updateData = { ...user };
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (password) updateData.password = password; // 실제로는 해시화 필요

    const updatedUser = await users.update(req.params.id, updateData);

    // 비밀번호 제거하고 반환
    const { password: _, ...safeUser } = updatedUser;
    res.json({ 
      message: 'User updated successfully',
      user: safeUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/users/:id
 * 사용자 삭제
 */
router.delete('/:id', async (req, res) => {
  try {
    await users.delete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
