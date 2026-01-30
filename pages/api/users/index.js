/**
 * 사용자 API - Next.js API Routes
 * GET /api/users
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
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
