/**
 * 공통코드(Common Code) API 라우트 - 파일 기반
 * 
 * @description 공통코드 관리를 위한 RESTful API 엔드포인트
 */

const express = require('express');
const router = express.Router();
const { commonCodes } = require('../fileStore');

/**
 * GET /api/common-codes
 * 공통코드 전체 조회
 */
router.get('/', async (req, res) => {
  try {
    const { group_code } = req.query;
    let result;

    if (group_code) {
      result = await commonCodes.getByGroup(group_code);
    } else {
      result = await commonCodes.getAll();
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching common codes:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/common-codes
 * 공통코드 생성
 */
router.post('/', async (req, res) => {
  try {
    const { group_code, code, name, name_en, name_ja, name_vi, sort_order } = req.body;

    if (!group_code || !code || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newCode = await commonCodes.create({
      group_code,
      code,
      name,
      name_en: name_en || '',
      name_ja: name_ja || '',
      name_vi: name_vi || '',
      sort_order: sort_order || 0
    });

    res.status(201).json({ 
      message: 'Common code created successfully',
      code: newCode
    });
  } catch (error) {
    console.error('Error creating common code:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/common-codes/:id
 * 공통코드 수정
 */
router.put('/:id', async (req, res) => {
  try {
    const { group_code, code, name, name_en, name_ja, name_vi, sort_order } = req.body;

    if (!group_code || !code || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const updatedCode = await commonCodes.update(req.params.id, {
      group_code,
      code,
      name,
      name_en: name_en || '',
      name_ja: name_ja || '',
      name_vi: name_vi || '',
      sort_order: sort_order || 0
    });

    res.json({ 
      message: 'Common code updated successfully',
      code: updatedCode
    });
  } catch (error) {
    console.error('Error updating common code:', error);
    if (error.message === 'Common code not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/common-codes/:id
 * 공통코드 삭제
 */
router.delete('/:id', async (req, res) => {
  try {
    await commonCodes.delete(req.params.id);
    res.json({ message: 'Common code deleted successfully' });
  } catch (error) {
    console.error('Error deleting common code:', error);
    if (error.message === 'Common code not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
