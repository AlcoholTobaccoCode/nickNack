const express = require('express');
const collectorTasksRouter = require('./routes/collectorTasks');
const getOnlineDataRouter = require('./routes/getOnlineData/index');

const app = express();
const port = 40001;

app.use(express.json());
app.use('/api', collectorTasksRouter);
app.use('/online-api', getOnlineDataRouter);
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
}); 