import React from 'react';
import { connect } from 'react-redux';
import { IndexRoute, Router, Route } from 'react-router';

// App
import AppContainer from 'components/app/AppContainer';
// Components
import Sidebar from 'components/sidebar/Sidebar';
// Pages
import HomePageContainer from 'components/pages/HomePageContainer';
import LoginPage from 'components/pages/LoginPage';
import RegisterPage from 'components/pages/RegisterPage';
import BusinessModelElementPage from 'components/pages/BusinessModelElementPage.jsx';

const Routes = ({ history }) => (
  <Router history={history}>
    <Route path="/" component={AppContainer}>
      <IndexRoute components={{ main: HomePageContainer, sidebar: Sidebar }} />
      <Route path="login">
        <IndexRoute components={{ main: LoginPage }} />
      </Route>
      <Route path="register">
        <IndexRoute components={{ main: RegisterPage }} />
      </Route>
      <Route path="business-model-element">
        <IndexRoute components={{ main: BusinessModelElementPage, sidebar: Sidebar }} />
      </Route>
    </Route>
  </Router>
);

Routes.propTypes = {
  history: React.PropTypes.object
};

export default connect()(Routes);
