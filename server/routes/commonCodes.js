const express = require('express');
const router = express.Router();
const { pool } = require('../index');

// 공통코드 그룹 조회
router.get('/groups', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT DISTINCT code_group FROM common_codes ORDER BY code_group');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 특정 그룹의 공통코드 조회
router.get('/group/:groupCode', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM common_codes WHERE code_group = ? ORDER BY sort_order',
      [req.params.groupCode]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 모든 공통코드 조회
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM common_codes ORDER BY code_group, sort_order');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 공통코드 등록
router.post('/', async (req, res) => {
  try {
    const { code_group, code, code_name, code_name_en, code_name_ja, sort_order, use_yn } = req.body;
    const [result] = await pool.query(
      'INSERT INTO common_codes (code_group, code, code_name, code_name_en, code_name_ja, sort_order, use_yn) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [code_group, code, code_name, code_name_en, code_name_ja, sort_order || 0, use_yn || 'Y']
    );
    res.status(201).json({ id: result.insertId, message: 'Common code created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 공통코드 수정
router.put('/:id', async (req, res) => {
  try {
    const { code_group, code, code_name, code_name_en, code_name_ja, sort_order, use_yn } = req.body;
    await pool.query(
      'UPDATE common_codes SET code_group = ?, code = ?, code_name = ?, code_name_en = ?, code_name_ja = ?, sort_order = ?, use_yn = ? WHERE id = ?',
      [code_group, code, code_name, code_name_en, code_name_ja, sort_order, use_yn, req.params.id]
    );
    res.json({ message: 'Common code updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 공통코드 삭제
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM common_codes WHERE id = ?', [req.params.id]);
    res.json({ message: 'Common code deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
