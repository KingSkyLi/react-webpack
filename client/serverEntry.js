import React from 'react';
import { StaticRouter } from 'react-router-dom'
import { Provider, useStaticRendering } from 'mobx-react';
import { creatStoreMap } from './store/store';
import App from './views/App';

// 让mobx在服务端渲染的时候不会重复的数据变换
useStaticRendering(true)
export default (stores, routerContext, url) => {
  console.log('<---------------------serverEntry.js----------------->');
  console.log(stores);
  console.log('<---------------------serverEntry.js----------------->');
  return (
    <Provider {...stores}>
      <StaticRouter context={routerContext} location={url}>
        <App />
      </StaticRouter>
    </Provider>
  )
}


export {
  creatStoreMap,
}
