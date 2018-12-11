// 用于http请求 （安装依赖 axios）
const axios = require('axios');
// 引入webpack
const webpack = require('webpack');
// 引入服务端渲染的webpack配置文件
const serverConfig = require('../../config/webpack.config.server.js');
// 引入path模块
const path = require('path');
// 安装memory-fs,用于读取内存中的文件 (安装memory-fs)
const MemoryFs = require('memory-fs');
// 引入ejs
const ejs = require('ejs');
// 序列化Object
const serialize = require('serialize-javascript');
// 引入react-dom/server
const ReactDomServer = require('react-dom/server');
// 引入代理中间件
const proxy = require('http-proxy-middleware');
// 引入helmet
const Helmet = require('react-helmet').default;
// 设置全局打包出的模块变量
let serverBundle, creatStoreMap;
// 获取模板
const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8086/public/server.ejs').then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err);
    });
  })
}
// react-async-bootstrapper 解决服务端数据渲染
const reactAsyncBootstrapper = require('react-async-bootstrapper');
// 取store中的数据
const getStoreState = (stores) => {
  console.log('<-------------dev-static.js------------->')
  console.log(Object.keys(stores.appState))
  console.log('<-------------dev-static.js------------->')
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson();
    return result;
  }, {})
  // return stores.appState.toJson();
}
// 手动打包，webpack的实例化
const serverCompiler = webpack(serverConfig);
// 实例化内存读取模块
const mfs = new MemoryFs;
// // 借用module对象的构造函数
// const Module = module.constructor;
const NativeModule = require('module');
const vm = require('vm');
const getModuleFromString = (bundle, filename) => {
  const m = { exports: {} };
  const wrapper = NativeModule.wrap(bundle); // module.wrap，执行后返回的代码 ·function(exports,require,module,__filename,__dirname){...bundle code}·
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true,
  })
  const result = script.runInThisContext();
  result.call(m.exports, m.exports, require, m);
  return m;
}
// webpack实例化的输出文件模式 写入内存
serverCompiler.outputFileSystem = mfs;
// 观察每次文件修改后变化
serverCompiler.watch({}, (err, stats) => {
  if (err) {
    throw err;
  }
  // 将修改的状态转化为数组对象
  stats = stats.toJson();
  // 打印错误
  stats.errors.forEach(err => {
    console.error(err);
  });
  // 打印警告
  stats.warnings.forEach(warn => console.warn(warn));
  // 打包文件的路径
  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  );
  // 内存中读取文件，并以utf-8的形式读取
  const bundle = mfs.readFileSync(bundlePath, 'utf-8');

  // 利用module的构造函数创建module
  // const m = new Module();
  // // 将打包出的js文件，用module解析
  // m._compile(bundle, 'serverEntry.js');
  const m = getModuleFromString(bundle,'server-entry.js');

  // 输出最新的bundle文件
  serverBundle = m.exports.default;
  creatStoreMap = m.exports.creatStoreMap;
})

// 输出一个方法,提供server.js中的调用入口
module.exports = function (app) {
  // 制定静态文件的路径
  app.use('/public', proxy({
    target: 'http://localhost:8086'
  }));
  app.get('*', function (req, res) {
    getTemplate().then(template => {
      const routerContext = {}
      const stores = creatStoreMap();
      const app = serverBundle(stores, routerContext, req.url);
      reactAsyncBootstrapper(app).then(() => {
        const content = ReactDomServer.renderToString(app);
        const state = getStoreState(stores);
        // 配合reacter-router,Redirect
        if (routerContext.url) {
          res.status(302).setHeader('Location', routerContext.url);
          res.end();
          return;
        }
        const helmet = Helmet.rewind();
        console.log('helmet.link.toString(),')
        console.log(helmet.meta.toString())
        const html = ejs.render(template, {
          appString: content,
          initialState: serialize(state),
          meta:helmet.meta.toString(),
          title:helmet.title.toString(),
          style:helmet.style.toString(),
          link:helmet.link.toString(),
        })
        res.send(html)
        //res.send(template.replace('<!--app-->', content))
      })

    })
  })
}
