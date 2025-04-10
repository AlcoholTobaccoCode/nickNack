const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/', async (req, res) => {
  return res.json({
    code: 200,
    message: 'success',
    data: null
  });
});

router.post('/uploadUseCount', async (req, res) => {
  try {
    const { openid, parseUrl } = req.body;
    
    if (!openid) {
      return res.status(400).json({
        code: 400,
        message: '缺少必要参数 openid',
        data: null
      });
    }

    const [rows] = await pool.execute(
      'INSERT INTO user_count (openid, parse_url) VALUES (?, ?)',
      [openid, parseUrl]
    );

    res.json({
      code: 200,
      message: '上传成功',
      data: null
    });

  } catch (error) {
    console.error('查询出错:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    });
  }
});

module.exports = router; 