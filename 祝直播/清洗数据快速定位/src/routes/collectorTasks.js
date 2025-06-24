const express = require('express');
const moment = require('moment');
const fetch = require('node-fetch');
const { getWssUrl } = require('./signature');
const { BrowserManager } = require('./playwrightApi');
const router = express.Router();
const pool = require('../config/database');

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


const sourceMap = {
  'ARTIFICIAL': '人工',
  'COLLECTOR': '采集器'
}
// 查询需要采集的任务信息
router.get('/getSourceTasks', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        code: 400,
        message: '缺少必要参数 url',
        data: null
      });
    }

    const [rows] = await pool.execute(
      'SELECT * FROM collector_tasks WHERE room_url = ? AND DATE(FROM_UNIXTIME(create_time)) = CURDATE()',
      [url]
    );

    const row = rows?.[0];

    if (!row) {
      return res.status(400).json({
        code: 400,
        message: '没有找到任务',
        data: null
      });
    }

    const controlTask = row.control_task;

    // 数据处理
    const formattedRows = {
      id: controlTask.id,
      source: sourceMap[controlTask.source],
      createTime: controlTask.createTime,
      createBy: controlTask.createBy,
      room_id: controlTask.room_id
    };

    console.log(`「${moment(row.create_time).format('YYYY-MM-DD HH:mm:ss')}」:task id => ${formattedRows.id}, source => ${formattedRows.source}`);

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

// 删除系统中指定 id 任务
let token = "91460329-9422-4757-add4-76b450e1ceaf";
const API_BASE_URL_ZHEJUE = "https://zhibo-test.yeeshun.net";

const deleteSourceTasks = async (id) => {
  const response = await fetch(`${API_BASE_URL_ZHEJUE}/ai-live-api/crawled/live/mark?id=${id}`, {
    method: 'DELETE',
    headers: {
      "authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  return await response.json();
}

const updateToken = async () => {
  const response = await fetch(`${API_BASE_URL_ZHEJUE}/ai-live-api/system/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'harvester',
      password: 'zhuyi123456'
    })
  });
  return await response.json();
}

// 删除需要采集的任务信息
router.get('/deleteSourceTasks', async (req, res) => {
  try {
    const { id, room_id } = req.query;

    if (!id || !room_id) {
      return res.status(400).json({
        code: 400,
        message: '缺少必要参数 id 或 room_id',
        data: null
      });
    }

    // 查询任务是否存在
    const [rows] = await pool.execute(
      'SELECT * FROM collector_tasks WHERE room_id = ? AND DATE(FROM_UNIXTIME(create_time)) = CURDATE()',
      [room_id]
    );

    const row = rows?.[0];

    // 删除系统中指定 id 任务
    const deleteTask = async () => {
      const result = await deleteSourceTasks(id);
      return result;
    };

    // 首次尝试删除
    let result = await deleteTask();

    // token过期,更新token后重试
    if (result.code === 401) {
      const auth = await updateToken();
      token = auth.data.accessToken;
      result = await deleteTask();
    }

    // 删除失败返回错误信息
    if (result.code !== 200) {
      return res.json({
        code: 500,
        message: '删除失败',
        data: null
      });
    }

    // 删除采集器任务
    if (row) {
      await pool.execute(
        'DELETE FROM collector_tasks WHERE room_id = ?',
        [room_id]
      );
    }

    // 删除上报数据
    await pool.execute(
      'DELETE FROM reptile_dy_live_data WHERE reptile_live_mark_id = ?',
      [id]
    );

    await pool.execute(
      'DELETE FROM reptile_chan_live_data WHERE reptile_task_id = ?',
      [id]
    );

    res.json({
      code: 200,
      message: '删除成功',
      data: null
    });
  } catch (error) {
    console.error('删除出错:', error);
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
  const response = await fetch(`${LIVE_DOMAIN}/live/promotions/page/?aid=6383&room_id=${roomId}&author_id=${authorId}&offset=${offset}&limit=${limit}`, {
    headers: {
      'accept': '*/*',
      'host': 'live.douyin.com',
      'connection': 'keep-alive',
      'referer': `https://live.douyin.com/${webRid}`,
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0',
      'cookie': cookie
    }
  });
  return await response.json();
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
      isTrue: result?.promotions ? true : false,
      msg: !result?.promotions ? result?.msg : null
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

const GenerateTtwid = async () => {
  const response = await fetch(`http://172.16.5.17:1801/api/douyin/web/generate_ttwid`);
  return await response.json();
}

const FetchUserLiveVideos = async (webcast_id) => {
  const response = await fetch(`http://172.16.5.17:1801/api/douyin/web/fetch_user_live_videos?webcast_id=${webcast_id}`);
  return await response.json();
}

const gotoLivePage = async ({
  url,
  roomId
}) => {

  return new Promise(async (resolve, reject) => {
    const browserManager = new BrowserManager();
    await browserManager.init();

  await browserManager.loadPage({
    url
  }, {
    onLoaded: async (page) => {
      console.log('页面加载完成 ✨✨✨', 'col');
      const wssUrl = await getWssUrl(page, roomId);
      // console.log('wssUrl => ', wssUrl);
      await browserManager.close();
      resolve(wssUrl);
    },
    onError: async (error) => {
        console.error(`页面加载错误: ${error.message}`, 'col');
        await browserManager.close();
      }
    });
  });
}

router.get('/getLiveRoomWs', async (req, res) => {
  try {
    const { web_rid } = req.query;
    
    if (!/\d{8,12}/.test(web_rid)) {
      return res.status(400).json({
        code: 400,
        message: '请输入正确的房间号',
        data: null
      });
    }

    const roomInfo = await FetchUserLiveVideos(web_rid);
    const finalRoomId = roomInfo?.data?.data?.enter_room_id;
    const roomName = roomInfo?.data?.data?.data?.[0]?.title;

    // 生成 ttwid
    const getTtwid = await GenerateTtwid();
    // 默认
    let ttwid = '1%7CUIsYBp9HOuSwq6dP59Qf4ZdjwNCcZll0VRSE5ePbFzM%7C1742140517%7C82c777ecf691fa5b9850bd97d52e53d4e2cd33bb60d90ff410a277bb6c9ab34c';
    if (getTtwid.code === 200) {
      ttwid = getTtwid.data.ttwid;
    }

    const wssUrl = await gotoLivePage({
      url: `https://live.douyin.com/${web_rid}`,
      roomId: finalRoomId
    });

    console.log(`「${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}」:web_rid => ${web_rid}`);

    res.json({
      code: 200,
      message: '查询成功',
      data: {
        wssUrl,
        ttwid,
        roomName
      }
    });

  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    });

  }
});

module.exports = router; 
