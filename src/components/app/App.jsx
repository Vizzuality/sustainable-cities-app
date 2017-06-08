import React from 'react';
import PropTypes from 'prop-types';
import { dispatch } from 'main';
import { getUserData } from 'modules/user';
import Header from 'components/header/HeaderContainer';
import ReduxToastr from 'react-redux-toastr';
import Modal from 'components/ui/Modal';

export default class App extends React.Component {

  componentWillMount() {
    if (this.props.user.logged && !this.props.user.data) {
      dispatch(getUserData());
    }
  }

  render() {
    return (
      <div>
        <Header />
        <main role="main" className="l-main">
          <div className="main-content l-app-wrapper">
            {this.props.nav &&
              <div className="content-header">
                {this.props.nav}
              </div>
            }
            <div className="content-content">
              {this.props.main}
            </div>
          </div>
        </main>
        {this.props.footer}
        <ReduxToastr />
        <Modal />
      </div>
    );
  }
}

App.propTypes = {
  user: PropTypes.object,
  main: PropTypes.element,
  footer: PropTypes.element,
  nav: PropTypes.element
};
