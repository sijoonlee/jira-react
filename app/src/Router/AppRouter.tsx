import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';

import SprintBetweenPage from '../Pages/SprintBetweenPage';
import BoardPage from '../Pages/BoardPage';
import { history } from './History';

export const AppRouter = () => {
  
  return <Router history={history}>
    <Switch>
      <Route path="/" exact component={SprintBetweenPage} />
      <Route path="/board" exact component={BoardPage} />
    </Switch>
  </Router>;
};