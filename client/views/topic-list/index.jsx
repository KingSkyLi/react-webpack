import React from 'react';
import {
  observer,
  inject,
} from 'mobx-react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import AppState from '../../store/app-state';

export default @inject('appState') @observer
class TopicList extends React.Component {
  constructor() {
    super();
    this.changeName = this.changeName.bind(this);
  }

  componentDidMount() {

  }

  // 服务端渲染的异步操作
  bootstrap() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.props.appState.count = 3
        resolve(true);
      }, 1000)
    })
  }

  changeName(event) {
    this.props.appState.changeName(event.target.value);
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>this is topic list</title>
          <meta name="des" content="des" />
        </Helmet>
        <input type="text" onChange={this.changeName} />
        <span>{this.props.appState.msg}</span>
      </div>
    )
  }
}

TopicList.propTypes = {
  appState: PropTypes.instanceOf(AppState).isRequired,
}
