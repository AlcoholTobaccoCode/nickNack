const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const HttpClient = require('../config/httpClient');

router.get('/', async (req, res) => {
  res.json({
    code: 200,
    message: '启动成功',
    data: null
  });
});


// 查询需要采集的任务信息
router.get('/tasks', async (req, res) => {
  try {
    const { room_id } = req.query;
    
    if (!room_id) {
      return res.status(400).json({
        code: 400,
        message: '缺少必要参数 room_id',
        data: null
      });
    }

    const [rows] = await pool.execute(
      'SELECT * FROM collector_tasks WHERE room_id = ?',
      [room_id]
    );

    const row = rows[0] || {};

    // 数据处理
    const formattedRows = {
      ...row.control_task
    };

    console.log(`「${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}」:task id => ${formattedRows.id}, liveUrl => ${formattedRows.liveUrl}`);

    res.json({
      code: 200,
      message: '查询成功',
      data: formattedRows
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


// 直播域名 (Live Domain)
const LIVE_DOMAIN = "https://live.douyin.com"

/**
 * @description 获取抖音直播间小黄车列表
 * @param {string} roomId 直播间ID
 * @param {string} webRid 房间id
 * @param {string} authorId 主播ID
 * @param {number} offset 偏移量
 * @param {number} limit 数量
 * @param {string} cookie 用户cookie
 */
const GetLiveRoomPromotions = async ({
    roomId,
    webRid,
    authorId,
    cookie,
    offset = 0,
    limit = 10
}) => {
    return await HttpClient.get(`${LIVE_DOMAIN}/live/promotions/page/`, {
        aid: '6383',
        room_id: roomId,
        author_id: authorId,
        offset,
        limit
    }, {
        headers: {
            'accept': '*/*',
            'host': 'live.douyin.com',
            'connection': 'keep-alive',
            'referer': `https://live.douyin.com/${webRid}`,
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0',
            'cookie': cookie
        }
    });
}

// 查询小黄车列表
router.get('/getDyPromotions', async (req, res) => {
  try {
    const { room_id, web_rid, author_id } = req.query;
    const cookie = req.headers.authorization;
    
    // 参数校验
    const requiredParams = {
      room_id: '直播间ID',
      web_rid: '房间ID', 
      author_id: '主播ID',
      cookie: 'Cookie'
    };

    const missingParams = Object.entries(requiredParams)
      .filter(([key]) => !eval(key))
      .map(([, value]) => value);

    if (missingParams.length > 0) {
      return res.status(400).json({
        code: 400,
        message: `缺少必要参数: ${missingParams.join(', ')}`,
        data: null
      });
    }

    const result = await GetLiveRoomPromotions({
        roomId: room_id,
        webRid: web_rid,
        authorId: author_id,
        cookie: cookie
    });

    const data = {
      promotions: result?.promotions,
      total: result?.total,
      isTrue: result?.promotions ? true : false
    };

    console.log(`「${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}」:promotions => ${data.promotions}, total => ${data.total}`);

    res.json({
      code: 200,
      message: '查询成功',
      data: data
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