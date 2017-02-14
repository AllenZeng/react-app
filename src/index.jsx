import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { browserHistory, Router } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';

import 'babel-polyfill';

import route from './containers/route';
import configureStore from './store/configureStore';
import trackClickEvent from './utils/trackClickEvent';

import '../public/iconmoon.css';
import '../public/css/base.css';
import '../public/css/content.css';
import '../public/css/xuan.css';
import '../public/css/animate.min.css';
import '../public/css/wx_login.css';

if (!('remove' in Element.prototype)) {
  Element.prototype.remove = function () {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };
}

document.addEventListener('click', (e) => {
  trackClickEvent(e);
});

const RootElement = document.createElement('div');
RootElement.id = 'main';
document.body.appendChild(RootElement);

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

function renderWithHotReload(routes) {
  render(
    <AppContainer>
      <Provider store={store}>
        <Router key={Math.random()} history={history} routes={routes} />
      </Provider>
    </AppContainer>,
    RootElement,
  );
}

renderWithHotReload(route);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./containers/route', () => {
    const newRoute = require('./containers/route').default;
    renderWithHotReload(newRoute);
  });
}
