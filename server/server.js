const express = require('express');
const fs = require('fs');
const path = require('path');
// const ReactSSR = require('react-dom/server');
const favicon = require('serve-favicon');
// 存储session
const session = require('express-session')
// 格式化请求数据
const bodyParser = require('body-parser');

const app = express();
// 将请求格式修改成req.body（post请求传递参数）
app.use(bodyParser.json());
// 对应表单的请求格式
app.use(bodyParser.urlencoded({ extended: false }));
const serverRender = require('./server-render.js');

app.use(session({
  maxAge: 10 * 60 * 1000,
  name: 'tid',
  resave: false,
  saveUninitialized: false,
  secret: 'react cnode class'
}))


app.use(favicon(path.join(__dirname, '../favicon.ico')));
// 使用不同的代理路由
app.use('/api/user', require('./handle-login'));
app.use('/api', require('./proxy'));
app.listen('3333', function () {
  console.log('3333连接成功');
});
// 判断是否是开发环境
const isDev = process.env.NODE_ENV === 'development';

if (!isDev) {
  const entry = require('../dist/serverEntry.js');
  const tempalteString = fs.readFileSync(path.join(__dirname, '../dist/server.ejs'), 'utf8');

  //指定静态文件返回路径
  app.use('/public', express.static(path.join(__dirname, '../dist')));
  app.get('*', function (req, res, next) {
    // const appString = ReactSSR.renderToString(entry);
    // 使用服务端返回的代码，替换客户端生成的模板<!--app-->部分，并声成完整的html
    // console.log(appString);
    // res.send(tempalteString.replace('<!--app-->', appString));
    // res.send(appString);
    serverRender(entry, tempalteString, req, res).catch(next)
  });
} else {
  const devStatic = require('./util/dev-static.js');
  devStatic(app);
}

app.use(function(error, req, res, next){
  console.log(error);
  res.status(500).send(error)
})


