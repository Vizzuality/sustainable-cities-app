import React from 'react';
import { connect } from 'react-redux';
import { IndexRoute, Router, Route } from 'react-router';

// App
import AppContainer from 'components/app/AppContainer';
// Components
import Sidebar from 'components/sidebar/Sidebar';
// Pages
import HomePage from 'components/pages/Home/HomePageContainer';
import LoginPage from 'components/pages/LoginPage';
import RegisterPage from 'components/pages/RegisterPage';
import BmePage from 'components/pages/Bme/BmePageContainer.jsx';
import NewBmePage from 'components/pages/Bme/NewBmePageContainer.jsx';
import StudyCasesPage from 'components/pages/StudyCasesPage';

const Routes = ({ history }) => (
  <Router history={history}>
    <Route path="/" component={AppContainer}>
      <IndexRoute components={{ main: HomePage, sidebar: Sidebar }} />
      <Route path="login">
        <IndexRoute components={{ main: LoginPage }} />
      </Route>
      <Route path="register">
        <IndexRoute components={{ main: RegisterPage }} />
      </Route>
      <Route path="study-cases">
        <IndexRoute components={{ main: StudyCasesPage, sidebar: Sidebar }} />
      </Route>
      <Route path="business-model-element">
        <IndexRoute components={{ main: BmePage, sidebar: Sidebar }} />
        <Route path="new" components={{ main: NewBmePage, sidebar: Sidebar }} />
      </Route>
    </Route>
  </Router>
);

Routes.propTypes = {
  history: React.PropTypes.object
};

export default connect()(Routes);
