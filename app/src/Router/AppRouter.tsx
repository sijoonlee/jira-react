import React from 'react';
import { Route, BrowserRouter, Switch, withRouter } from 'react-router-dom';

import SprintBetweenPage from '../Pages/SprintBetweenPage';
import BoardPage from '../Pages/BoardPage';
import ProjectPage from '../Pages/ProjectPage';
// import { history } from './History';

export const AppRouter = () => {
  
  return <BrowserRouter>
    <Switch>
      <Route path="/" exact component={withRouter(BoardPage)} />
      <Route path="/sprintBetween" exact component={withRouter(SprintBetweenPage)} />
      <Route path="/board" exact component={withRouter(BoardPage)} />
      <Route path="/project" exact component={withRouter(ProjectPage)} />
    </Switch>
  </BrowserRouter>;
};