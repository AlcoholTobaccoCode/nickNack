const poolOnline = require('../../config/database-online.js');
const moment = require('moment');

/**
 * @description: 处理日期参数
 * @param {string} date - 指定查询日期，格式为 'YYYY-MM-DD HH:mm:ss'，可选参数
 * @returns {Object} 返回包含以下字段的对象：
 *   - query: {string} 查询条件
 *   - params: {Array} 查询参数
 *   - timeRanges: {Object} 查询的时间范围信息
 *     - startDate: {string} 开始时间
 *     - endDate: {string} 结束时间
 */
const dateProcess = (date) => {
  // 确定查询的日期范围
  const targetDate = date ? moment(date) : moment();
  const startDate = targetDate.format('YYYY-MM-DD 00:00:00');
  const endDate = targetDate.add(1, 'day').format('YYYY-MM-DD 00:00:00');
  
  // 构建查询条件和参数
  const query = ` AND create_time >= ? AND create_time < ?`;
  const params = [startDate, endDate];
  
  // 构建时间范围信息
  const timeRanges = {
    startDate,
    endDate: targetDate.format('YYYY-MM-DD HH:mm:ss')
  };

  return {
    query,
    params,
    timeRanges
  };
};

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
    // 处理日期条件
    const {
      query: dateQuery,
      params: dateParams,
      timeRanges: dateTimeRanges
    } = dateProcess(date);

    // 构建查询语句
    const baseQuery = `
      SELECT COUNT(*) AS total
      FROM reptile_live_mark
      WHERE 1=1
    `;
    
    const statusQuery = isComplete === 1 ? ` AND task_status = 'CRAWLING_COMPLETE'` : '';
    const query = baseQuery + dateQuery + statusQuery;
    const params = [...dateParams];
    
    const [rows] = await poolOnline.execute(query, params);
    
    return {
      total: rows[0].total,
      isComplete: isComplete === 1,
      timeRanges: dateTimeRanges
    };
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
    // 处理日期条件
    const {
      query: dateQuery,
      params: dateParams
    } = dateProcess(date);

    const baseQuery = `
      SELECT COUNT(*) as total 
      FROM reptile_chan_live_data 
      WHERE 1=1
    `;
    
    const query = baseQuery + dateQuery;
    const params = [...dateParams];

    const [rows] = await poolOnline.execute(query, params);
    
    return rows[0].total;
  } catch (error) {
    console.error('获取有效素材数失败:', error);
    throw error;
  }
};

/**
 * @description: 查询素材使用情况
 * @param {string} date - 指定查询日期，格式为 'YYYY-MM-DD HH:mm:ss'，可选参数,默认当天
 * @param {number} isAll - 是否查询当天内的素材使用情况，默认为 0,查询当天内的素材使用情况， 1 查询所有
 * @returns {Promise<Object>} 返回包含以下字段的对象：
 *   - total: {number} 任务总数
 *   - isAll: {boolean} 查询的完成状态条件
 *   - timeRanges: {Object} 查询的时间范围信息
 *     - startDate: {string} 开始时间
 *     - endDate: {string} 结束时间
 * @throws {Error} 当数据库查询失败时抛出错误
 */
const GetMaterialUsage = async (date, isAll = 0) => {
  try {
    // 处理日期条件
    const {
      query: dateQuery,
      params: dateParams,
      timeRanges: dateTimeRanges
    } = dateProcess(date);

    const baseQuery = `
      SELECT SUM(like_count) as total 
      FROM reptile_chan_live_data 
      WHERE 1 = 1 
    `;

    const query = isAll == 0 ? baseQuery + dateQuery : baseQuery;
    const params = [...dateParams];

    const [rows] = await poolOnline.execute(query, params);

    return {
        total: rows[0].total || 0,
        isAll: isAll === 1 ? true : false,
        timeRanges: dateTimeRanges
    }

  } catch (error) {
    console.error('获取素材使用情况失败:', error);
    throw error;
  }
};

module.exports = {
  GetLiveMarkCount,
  GetValidMaterialCount,
  GetMaterialUsage
}