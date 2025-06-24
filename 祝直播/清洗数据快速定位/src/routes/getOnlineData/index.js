const express = require("express");
const moment = require("moment");

const router = express.Router();

const {
  GetLiveMarkCount,
  GetValidMaterialCount
} = require("./utils.js");

router.get("/", (req, res) => {
  res.send("Hello World!!!");
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

    let today = date
      ? moment(date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss")
      : null;

    const total = await GetLiveMarkCount(today, isComplete);

    const dataTemp = {
      code: 200,
      message: "查询成功",
      data: {
        ...total,
      },
    };

    res.send(dataTemp);
  } catch (error) {
    res.send({
      code: 400,
      message: error,
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

    let today = date
      ? moment(date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss")
      : null;

    const total = await GetValidMaterialCount(today);

    const dataTemp = {
      code: 200,
      message: "查询成功",
      data: {
        total,
      },
    };

    res.send(dataTemp);
  } catch (error) {
    res.send({
      code: 400,
      message: error,
    });
  }
});

module.exports = router;
