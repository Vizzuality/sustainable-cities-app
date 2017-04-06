import React from 'react';
import { connect } from 'react-redux';
import { IndexRoute, Router, Route } from 'react-router';

// App
import App from 'components/app/App';
// Header
import Header from 'components/header/Header';
// Pages
import HomePage from 'components/pages/HomePage';
import LoginPage from 'components/pages/LoginPage';
import BusinessModelElementPage from 'components/pages/BusinessModelElementPage.jsx';

const Routes = ({ history }) => (
  <Router history={history}>
    <Route path="/" component={App}>
      <IndexRoute components={{ main: HomePage, header: Header }} />
      <Route path="login">
        <IndexRoute components={{ main: LoginPage, header: Header }} />
      </Route>
      <Route path="business-model-element">
        <IndexRoute components={{ main: BusinessModelElementPage, header: Header }} />
      </Route>
    </Route>
  </Router>
);

Routes.propTypes = {
  history: React.PropTypes.object
};

export default connect()(Routes);
