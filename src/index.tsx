import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch, Route } from 'react-router';
import { createBrowserHistory } from 'history';
import 'normalize.css';

import './index.css';
import App from './App';
import Game from './game/Game';
import * as serviceWorker from './serviceWorker';

const Chess = () => (
  <div>
    <div className="center">
      <Router history={createBrowserHistory()}>
        <Switch>
          <Route exact path="/" component={App} />
          <Route exact path="/:gameId/" component={Game} />
        </Switch>
      </Router>
    </div>
  </div>
);

ReactDOM.render(<Chess />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
