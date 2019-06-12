import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, withRouter } from 'react-router-dom';

import App from './components/App';


import AuthService from './services/auth';
import ArticlesService from './services/articles';
import * as serviceWorker from './serviceWorker';
import NotficationsService from './services/notifications';


const Main = withRouter(props => ((
  <App
    authService={new AuthService()}
    articlesService={new ArticlesService()}
    notyService={new NotficationsService()}
    {...props}
  />
)));

ReactDOM.render(
  <BrowserRouter>
    <Main />
  </BrowserRouter>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
