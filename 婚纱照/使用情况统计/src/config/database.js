const mysql = require('mysql2/promise');

const dbConfig = {
  // host: '124.222.150.175',
  host: '127.0.0.1',
  port: 13316,
  user: 'root',
  password: 'MmrH27QQCCegMJnx',
  database: 'identity_mini_app'
};

const pool = mysql.createPool(dbConfig);

module.exports = pool; 