const mysql = require('mysql2/promise');

const dbConfig = {
  host: '120.26.228.188',
  port: 3306,
  user: 'root',
  password: 'wRb7c$7LKD',
  database: 'ai-live-online'
};

const poolOnline = mysql.createPool(dbConfig);

module.exports = poolOnline;
