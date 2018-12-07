const express = require('express');
const fs = require('fs');
const path = require('path');
const ReactSSR = require('react-dom/server');
const favicon = require('serve-favicon');
// 存储session
const session = require('express-session')
// 格式化请求数据
const bodyParser = require('body-parser');



const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  maxAge: 10 * 60 * 1000,
  name: 'tid',
  resave: false,
  saveUninitialized: false,
  secret: 'react cnode class'
}))

app.use(favicon(path.join(__dirname,'../favicon.ico')));
app.use('/api/user',require('./handle-login'));
app.use('/api',require('./proxy'));
app.listen('3333', function () {
  console.log('3333连接成功');
});
// 判断是否是开发环境
const isDev = process.env.NODE_ENV === 'development';



if (!isDev) {
  const entry = require('../dist/serverEntry.js').default;
  const tempalteString = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8');

  //指定静态文件返回路径
  app.use('/public', express.static(path.join(__dirname, '../dist')));
  app.get('*', function (req, res) {
    const appString = ReactSSR.renderToString(entry);
    // 使用服务端返回的代码，替换客户端生成的模板<!--app-->部分，并声成完整的html
    console.log(appString);
    res.send(tempalteString.replace('<!--app-->', appString));
    // res.send(appString);
  });

}else{
  const devStatic  = require('./util/dev-static.js');
  devStatic(app);
}


