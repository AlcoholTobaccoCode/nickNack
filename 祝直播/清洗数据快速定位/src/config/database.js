const mysql = require('mysql2/promise');

const dbConfig = {
  host: '120.26.228.188',
  port: 3306,
  user: 'root',
  password: 'wRb7c$7LKD',
  database: 'ai-live-test'
};

const pool = mysql.createPool(dbConfig);

module.exports = pool; 