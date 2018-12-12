// 引入ejs
const ejs = require('ejs');
// 序列化Object
const serialize = require('serialize-javascript');
// react-async-bootstrapper 解决服务端数据渲染
const reactAsyncBootstrapper = require('react-async-bootstrapper');
// 引入react-dom/server
const ReactDomServer = require('react-dom/server');
// 引入helmet
const Helmet = require('react-helmet').default;
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

module.exports = (bundle, template, req, res) => {
  return new Promise((resolve, reject) => {
    const routerContext = {}
    const creatStoreMap = bundle.creatStoreMap;
    const createApp = bundle.default
    const stores = creatStoreMap();
    const app = createApp(stores, routerContext, req.url);
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
      resolve()
      //res.send(template.replace('<!--app-->', content))
    }).catch(reject)
  })
}
