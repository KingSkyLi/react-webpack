import React from 'react';
import { Route } from 'react-router-dom';
import TopicList from '../views/topic-list/index';
import TopicDetail from '../views/topic-detail/index';
import TestApi from '../views/test/api.test';

export default () => [
  <Route path="/" component={TopicList} exact />,
  <Route path="/detail" component={TopicDetail} />,
  <Route path="/test" component={TestApi} />,
]
