const poolOnline = require('../../config/database-online.js');
const moment = require('moment');

/**
 * @description: 查询直播打分表任务数
 * @param {string} date - 指定查询日期，格式为 'YYYY-MM-DD HH:mm:ss'，可选参数
 * @param {number} isComplete - 是否只查询已完成的任务，默认为 0,查询所有
 * @returns {Promise<Object>} 返回包含以下字段的对象：
 *   - total: {number} 任务总数
 *   - isComplete: {boolean} 查询的完成状态条件
 *   - timeRanges: {Object} 查询的时间范围信息
 *     - startDate: {string} 开始时间
 *     - endDate: {string} 结束时间
 * @throws {Error} 当数据库查询失败时抛出错误
 */
const GetLiveMarkCount = async (date, isComplete = 0) => {
  try {
    // 构建基础查询语句
    let query = `
      SELECT count(*) AS total
      FROM reptile_live_mark
      WHERE 1=1
    `;
    
    const params = [];
    
    // 处理日期条件
    if (date) {
      // 如果传入指定日期，获取该日期 00:00:00 到次日 00:00:00 的数据
      const startDate = moment(date).format('YYYY-MM-DD 00:00:00');
      const endDate = moment(date).add(1, 'day').format('YYYY-MM-DD 00:00:00');
      query += ` AND create_time >= ? AND create_time < ?`;
      params.push(startDate, endDate);
    } else {
      // 如果没传指定日期，获取当天 00:00:00 到次日 00:00:00 的数据
      const startDate = moment().format('YYYY-MM-DD 00:00:00');
      const endDate = moment().add(1, 'day').format('YYYY-MM-DD 00:00:00');
      query += ` AND create_time >= ? AND create_time < ?`;
      params.push(startDate, endDate);
    }
    
    // 处理完成状态条件
    if (isComplete == 1) {
      query += ` AND task_status = 'CRAWLING_COMPLETE'`;
    }
    
    const [rows] = await poolOnline.execute(query, params);
    
    let timeRanges;
    if (date) {
      timeRanges = {
        startDate: moment(date).format('YYYY-MM-DD 00:00:00'),
        endDate: moment(date).add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
      };
    } else {
      timeRanges = {
        startDate: moment().format('YYYY-MM-DD 00:00:00'),
        endDate: moment().add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
      };
    }
    
    return {
        total: rows[0].total,
        isComplete: isComplete === 1 ? true : false,
        timeRanges: timeRanges
    }
  } catch (error) {
    console.error('获取直播打分表数据失败:', error);
    throw error;
  }
};

/**
 * @description: 获取有效素材数
 * @param {string} date - 指定查询日期，格式为 'YYYY-MM-DD HH:mm:ss'，可选参数
 * @returns {Promise<number>} 返回有效素材总数
 */
const GetValidMaterialCount = async (date) => {
  try {
    let query = `
      SELECT COUNT(*) as total 
      FROM reptile_chan_live_data 
    `;
    
    const params = [];
    
    // 处理日期条件
    if (date) {
      // 如果传入指定日期，获取该日期 00:00:00 到次日 00:00:00 的数据
      const startDate = moment(date).format('YYYY-MM-DD 00:00:00');
      const endDate = moment(date).add(1, 'day').format('YYYY-MM-DD 00:00:00');
      query += ` WHERE create_time >= ? AND create_time < ?`;
      params.push(startDate, endDate);
    } else {
      // 如果没传指定日期，获取当天 00:00:00 到次日 00:00:00 的数据
      const startDate = moment().format('YYYY-MM-DD 00:00:00');
      const endDate = moment().add(1, 'day').format('YYYY-MM-DD 00:00:00');
      query += ` WHERE create_time >= ? AND create_time < ?`;
      params.push(startDate, endDate);
    }
    
    const [rows] = await poolOnline.execute(query, params);
    
    return rows[0].total;
  } catch (error) {
    console.error('获取有效素材数失败:', error);
    throw error;
  }
};

module.exports = {
  GetLiveMarkCount,
  GetValidMaterialCount
}