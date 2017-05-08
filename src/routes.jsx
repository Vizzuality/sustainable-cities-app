import React from 'react';
import { connect } from 'react-redux';
import { IndexRoute, Router, Route } from 'react-router';

// App
import AppContainer from 'components/app/AppContainer';

// Components
import Sidebar from 'components/sidebar/Sidebar';

// Pages
import HomePage from 'components/pages/Home/HomePage';
import LoginPage from 'components/pages/LoginPage';
import RegisterPage from 'components/pages/RegisterPage';
//    - Bme
import BmePage from 'components/pages/Bme/BmePage.jsx';
import NewBmePage from 'components/pages/Bme/NewBmePage.jsx';
import EditBmePage from 'components/pages/Bme/EditBmePage';
//    - Study case
import StudyCasePage from 'components/pages/StudyCase/StudyCasesPage';
import NewStudyCasePage from 'components/pages/StudyCase/NewStudyCasePage';
//    - Source
import SourcePage from 'components/pages/Source/SourcePage';
import NewSourcePage from 'components/pages/Source/NewSourcePage';
import EditSourcePage from 'components/pages/Source/EditSourcePage';
//    - Impact
import ImpactPage from 'components/pages/Impact/ImpactPage';
import NewImpactPage from 'components/pages/Impact/NewImpactPage';
import EditImpactPage from 'components/pages/Impact/EditImpactPage';
//    - Enabling Conditions
import EnablingPage from 'components/pages/Enabling/EnablingPage';
import NewEnablingPage from 'components/pages/Enabling/NewEnablingPage';
import EditEnablingPage from 'components/pages/Enabling/EditEnablingPage';

// Url hooks
import {
  onEnterEditBmePage,
  onEnterEditEnablingPage,
  onEnterEditImpactPage,
  onEnterEditSourcePage
} from 'modules/url';

const Routes = ({ history }) => (
  <Router history={history}>
    <Route path="/" component={AppContainer}>
      <IndexRoute components={{ main: HomePage, nav: Sidebar }} />
      <Route path="login">
        <IndexRoute components={{ main: LoginPage }} />
      </Route>
      <Route path="register">
        <IndexRoute components={{ main: RegisterPage }} />
      </Route>
      <Route path="study-cases">
        <IndexRoute components={{ main: StudyCasePage, nav: Sidebar }} />
        <Route path="new" components={{ main: NewStudyCasePage, nav: Sidebar }} />
      </Route>
      <Route path="business-model-element">
        <IndexRoute components={{ main: BmePage, nav: Sidebar }} />
        <Route path="new" components={{ main: NewBmePage, nav: Sidebar }} />
        <Route path="edit/:id" components={{ main: EditBmePage, nav: Sidebar }} onEnter={onEnterEditBmePage} />
      </Route>
      <Route path="source">
        <IndexRoute components={{ main: SourcePage, nav: Sidebar }} />
        <Route path="new" components={{ main: NewSourcePage, nav: Sidebar }} />
        <Route path="edit/:id" components={{ main: EditSourcePage, nav: Sidebar }} onEnter={onEnterEditSourcePage} />
      </Route>
      <Route path="impact">
        <IndexRoute components={{ main: ImpactPage, nav: Sidebar }} />
        <Route path="new" components={{ main: NewImpactPage, nav: Sidebar }} />
        <Route
          path="edit/:id"
          components={{ main: EditImpactPage, nav: Sidebar }}
          onEnter={onEnterEditImpactPage}
        />
      </Route>
      <Route path="enabling-condition">
        <IndexRoute components={{ main: EnablingPage, nav: Sidebar }} />
        <Route path="new" components={{ main: NewEnablingPage, nav: Sidebar }} />
        <Route path="edit/:id" components={{ main: EditEnablingPage, nav: Sidebar }} onEnter={onEnterEditEnablingPage} />
      </Route>
    </Route>
  </Router>
);

Routes.propTypes = {
  history: React.PropTypes.object
};

export default connect()(Routes);
