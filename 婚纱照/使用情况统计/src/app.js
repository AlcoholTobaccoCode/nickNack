const express = require('express');
const useCountRouter = require('./routes/useCount');

const app = express();
const port = 40002;

app.use(express.json());
app.use('/api', useCountRouter);

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
}); 