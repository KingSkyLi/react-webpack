import AppStateClass from './app-state';

export const AppState = AppStateClass;
console.log(AppStateClass)
export default {
  AppState,
}
// 供服务端渲染使用
export const creatStoreMap = () => (
  {
    appState: new AppState(),
  }
)
