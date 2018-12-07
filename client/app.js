import React from 'react';
import ReactDom from 'react-dom';
// 使用热更新辅助
import { AppContainer } from 'react-hot-loader'; //eslint-disable-line
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import appState from './store/app-state';
import App from './views/App';
// 封装DOM节点
const root = document.getElementById('root');
// 封装渲染函数
const render = (Component) => {
  ReactDom.render(
    <AppContainer>
      <Provider appState={appState}>
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    root,
  )
}
// 执行渲染函数
render(App);
if (module.hot) {
  // 热更新的代码
  module.hot.accept('./views/App', () => {
    const NextApp = require('./App').default;//eslint-disable-line
    render(NextApp);
  })
}
