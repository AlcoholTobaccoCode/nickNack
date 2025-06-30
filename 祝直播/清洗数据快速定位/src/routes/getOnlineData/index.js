const express = require("express");
const moment = require("moment");

const router = express.Router();

const {
  GetLiveMarkCount,
  GetValidMaterialCount,
  GetMaterialUsage
} = require("./utils.js");

router.get("/", (req, res) => {
  const date = {
    code: 200,
    message: '获取成功',
    currentTime: moment().valueOf(),
    formatDate: moment().format('YYYY-MM-DD HH:mm:ss')
  }
  res.send(date);
});

router.get("/getYesterdayData", (req, res) => {
  const date = {
    code: 200,
    message: '获取成功',
    yesterdayTime: moment().subtract(1, 'day').valueOf(),
    formatDate: moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss')
  }
  res.send(date);
});

/**
 * @description: 获取指定日期数据
 * @param {string} date - 指定查询日期，格式为 'YYYY-MM-DD HH:mm:ss'，可选参数
 * @param {number} isComplete - 是否只查询已完成的任务，默认为 0,查询所有
 * @returns {Promise<Object>} 返回包含以下字段的对象：
 *   - total: {number} 任务总数
 *   - isComplete: {boolean} 查询的完成状态条件
 *   - timeRanges: {Object} 查询的时间范围信息
*/
router.get("/getDataByDay", async (req, res) => {
  try {
    const { date, isComplete } = req.query;

    // 优化日期处理逻辑
    const today = date ? moment(date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : null;

    const result = await GetLiveMarkCount(today, isComplete);

    res.send({
      code: 200,
      message: "查询成功",
      data: result
    });
  } catch (error) {
    console.error('获取指定日期数据失败:', error);
    res.status(400).send({
      code: 400,
      message: error.message || '查询失败'
    });
  }
});


/**
 * @description: 获取有效素材数
 * @param {string} date - 指定查询日期，格式为 'YYYY-MM-DD HH:mm:ss'，可选参数
 * @returns {Promise<Object>} 返回包含以下字段的对象：
 *   - total: {number} 有效素材总数
*/
router.get("/getValidMaterialCount", async (req, res) => {
  try {
    const { date } = req.query;

    const total = await GetValidMaterialCount(date);

    res.send({
      code: 200,
      message: "查询成功",
      data: { total }
    });
  } catch (error) {
    res.send({
      code: 400,
      message: error.message || error
    });
  }
});

// 获取素材使用情况
router.get("/getMaterialUsage", async (req, res) => {
  try {
    const { date, isAll } = req.query;

    const result = await GetMaterialUsage(date, isAll);

    const dataTemp = {
      code: 200,
      message: "查询成功",
      data: result,
    };

    res.send(dataTemp);
  } catch (error) {
    res.send({
      code: 400,
      message: error.message || error,
    });
  }
});

module.exports = router;
