import React from 'react';
import ReactDom from 'react-dom';
// 使用热更新辅助
import { AppContainer } from 'react-hot-loader'; //eslint-disable-line
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import AppState from './store/app-state';
import App from './views/App';

const initialState = window.__INITIAL__STATE__||{};//eslint-disable-line
// 封装DOM节点
const root = document.getElementById('root');
// 封装渲染函数
// Provider 中注入 appState = {new AppState()} 与下列写法相同
const render = (Component) => {
  const stores = {
    appState: new AppState(initialState.appState),
  }
  ReactDom.render(
    <AppContainer>
      {/* <Provider appState = {new AppState()> */}
      <Provider {...stores}>
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
