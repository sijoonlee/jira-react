import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'

const history = createBrowserHistory();

ReactDOM.render((
  <Router history={history}>
    <div>abc</div>
  </Router>
), document.getElementById('root'))