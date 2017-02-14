import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import Container from './Container';

function asyncAppViewResolver(viewName) {
  return (nextState, cb) =>
    import(`../pages/${viewName}`)
      .then(module => cb(null, module.default || module))
      .catch(err => console.log(err));
}

export default (
  <Route path="/" component={Container} >
    <IndexRoute getComponent={asyncAppViewResolver('PageIndex')} />
    <Route path="aboutUs" getComponent={asyncAppViewResolver('PageAboutUs')} />
    <Route path="downloadApp" getComponent={asyncAppViewResolver('PageDownloadApp')} />
    <Route path="agreement" getComponent={asyncAppViewResolver('PageAgreement')} />

    <Route path="scan" getComponent={asyncAppViewResolver('PageScanQRCode')} />

    <Route path="*" getComponent={asyncAppViewResolver('PageNotFound')} />
  </Route>
);
