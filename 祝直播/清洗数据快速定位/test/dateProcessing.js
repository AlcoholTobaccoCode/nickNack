const moment = require('moment');

const dateProcess = (date) => {
  let query = '';
  let params = [];
  
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

  return {
    query,
    params
  }
}

console.log(dateProcess('2025-06-24'));
console.log(dateProcess());