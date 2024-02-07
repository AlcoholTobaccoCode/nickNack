var https = require("https");
var ws = require("ws");
var fs = require("fs");
var keypath = process.cwd() + "/csr.pem"; //我把秘钥文件放在运行命令的目录下测试
var certpath = process.cwd() + "/file.crt"; //console.log(keypath);
// console.log(certpath);

var options = {
  key: fs.readFileSync(keypath),
  cert: fs.readFileSync(certpath),
  passphrase: "1234", //如果秘钥文件有密码的话，用这个属性设置密码
};

var server = https
  .createServer(options, function (req, res) {
    //要是单纯的https连接的话就会返回这个东西
    res.writeHead(403); //403即可
    res.end("This is a WebSockets server!\n");
  })
  .listen(15449);

var wss = new ws.Server({ server: server }); //把创建好的https服务器丢进websocket的创建函数里，ws会用这个服务器来创建wss服务
//同样，如果丢进去的是个http服务的话那么创建出来的还是无加密的ws服务
wss.on("connection", function (wsConnect) {
  wsConnect.on("message", function (message) {
    console.log(message);
  });
});
