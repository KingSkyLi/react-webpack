import React from 'react'
import { Link } from 'react-router-dom';
import Routes from '../config/router';


class App extends React.Component {
  componentDidMount() {

  }

  render() {
    return [
      <div>
        <Link to="/">首页123</Link>
        <br />
        <Link to="/detail">详情页</Link>
        <br />
        <Link to="/test">testApi</Link>
      </div>,
      <Routes />,
    ]
  }
}
export default App;
