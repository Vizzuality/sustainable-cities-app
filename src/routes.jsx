import React from 'react';
import PropTypes from 'prop-types';
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
import BmePage from 'components/pages/Bme/BmePage';
import NewBmePage from 'components/pages/Bme/NewBmePage';
import EditBmePage from 'components/pages/Bme/EditBmePage';
//    - Study case
import StudyCasePage from 'components/pages/StudyCase/StudyCasesPage';
import NewStudyCasePage from 'components/pages/StudyCase/NewStudyCasePage';
import EditStudyCasePage from 'components/pages/StudyCase/EditStudyCasePage';
//    - Category
import CategoryPage from 'components/pages/Category/CategoryPage';
import NewCategoryPage from 'components/pages/Category/NewCategoryPage';
import EditCategoryPage from 'components/pages/Category/EditCategoryPage';
//    - Impact
import ImpactPage from 'components/pages/Impact/ImpactPage';
import NewImpactPage from 'components/pages/Impact/NewImpactPage';
import EditImpactPage from 'components/pages/Impact/EditImpactPage';
//    - Enabling Conditions
import EnablingPage from 'components/pages/Enabling/EnablingPage';
import NewEnablingPage from 'components/pages/Enabling/NewEnablingPage';
import EditEnablingPage from 'components/pages/Enabling/EditEnablingPage';
//    - City
import CityPage from 'components/pages/City/CityPage';
import NewCityPage from 'components/pages/City/NewCityPage';
import EditCityPage from 'components/pages/City/EditCityPage';
//    - Blogs
import BlogsPage from 'components/pages/Blog/BlogsPage';
import NewBlogsPage from 'components/pages/Blog/NewBlogsPage';
import EditBlogsPage from 'components/pages/Blog/EditBlogsPage';
//    - Events
// import EventsPage from 'components/pages/Events/EventsPage';
// import NewEventsPage from 'components/pages/Events/NewEventsPage';
// import EditEventsPage from 'components/pages/Events/EditEventsPage';
// //    - City Support
// import CitySupportPage from 'components/pages/CitySupport/CitySupportPage';
// import NewCitySupportPage from 'components/pages/CitySupport/NewCitySupportPage';
// import EditCitySupportPage from 'components/pages/CitySupport/EditCitySupportPage';


// Url hooks
import {
  onEnterEditBmePage,
  onEnterEditEnablingPage,
  onEnterEditImpactPage,
  onEnterEditStudyCase,
  onEnterEditCategoryPage,
  onEnterEditCityPage,
  onEnterEditBlogsPage,
  onEnterEditEventsPage,
  onEnterEditCitySupportPage
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
        <Route
          path="edit/:id"
          onEnter={onEnterEditStudyCase}
          components={{ main: EditStudyCasePage, nav: Sidebar }}
        />
      </Route>
      <Route path="business-model-element">
        <IndexRoute components={{ main: BmePage, nav: Sidebar }} />
        <Route path="new" components={{ main: NewBmePage, nav: Sidebar }} />
        <Route path="edit/:id" components={{ main: EditBmePage, nav: Sidebar }} onEnter={onEnterEditBmePage} />
      </Route>
      <Route path="category">
        <IndexRoute components={{ main: CategoryPage, nav: Sidebar }} />
        <Route path="new" components={{ main: NewCategoryPage, nav: Sidebar }} />
        <Route
          path="edit/:id"
          components={{ main: EditCategoryPage, nav: Sidebar }}
          onEnter={onEnterEditCategoryPage}
        />
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
        <Route
          path="edit/:id"
          components={{ main: EditEnablingPage, nav: Sidebar }}
          onEnter={onEnterEditEnablingPage}
        />
      </Route>
      <Route path="cities">
        <IndexRoute components={{ main: CityPage, nav: Sidebar }} />
        <Route path="new" components={{ main: NewCityPage, nav: Sidebar }} />
        <Route
          path="edit/:id"
          components={{ main: EditCityPage, nav: Sidebar }}
          onEnter={onEnterEditCityPage}
        />
      </Route>
      <Route path="blogs">
        <IndexRoute components={{ main: BlogsPage, nav: Sidebar }} />
        <Route path="new" components={{ main: NewBlogsPage, nav: Sidebar }} />
        <Route
          path="edit/:id"
          components={{ main: EditBlogsPage, nav: Sidebar }}
          onEnter={onEnterEditBlogsPage}
        />
      </Route>
      {/* <Route path="events">
        <IndexRoute components={{ main: EventsPage, nav: Sidebar }} />
        <Route path="new" components={{ main: NewEventsPage, nav: Sidebar }} />
        <Route
          path="edit/:id"
          components={{ main: EditEventsPage, nav: Sidebar }}
          onEnter={onEnterEventsPage}
        />
      </Route>
      <Route path="city-supports">
        <IndexRoute components={{ main: CitySupportPage, nav: Sidebar }} />
        <Route path="new" components={{ main: NewCitySupportPage, nav: Sidebar }} />
        <Route
          path="edit/:id"
          components={{ main: EditCitySupportPage, nav: Sidebar }}
          onEnter={onEnterCitySupportPage}
        />
      </Route> */}
    </Route>
  </Router>
);

Routes.propTypes = {
  history: PropTypes.object
};

export default connect()(Routes);
