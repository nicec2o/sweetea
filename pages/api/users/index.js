/**
 * 사용자 API - Next.js API Routes
 * GET/POST /api/users
 */

import { users } from '../../../lib/fileStore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await users.getAll();
      // 비밀번호 제거
      const safeUsers = result.map(({ password, ...user }) => user);
      res.status(200).json(safeUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, email, phone, address, password } = req.body;

      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }

      // 이메일 중복 체크
      const existingUser = await users.getByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const newUser = await users.create({
        name,
        email,
        phone: phone || '',
        address: address || '',
        password: password || 'temp123',
        role: 'user'
      });

      // 비밀번호 제거 후 반환
      const { password: _, ...safeUser } = newUser;
      
      res.status(201).json({ 
        message: 'User created successfully',
        user: safeUser
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
