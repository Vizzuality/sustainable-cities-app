import React from 'react';
import { dispatch } from 'main';
import { getUserData } from 'modules/user';
import Header from 'components/header/HeaderContainer';

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
            {this.props.sidebar &&
              <div className="content-sidebar">
                {this.props.sidebar}
              </div>
            }
            <div className="content-content">
              {this.props.main}
            </div>
          </div>
        </main>
        {this.props.footer}
      </div>
    );
  }
}

App.propTypes = {
  user: React.PropTypes.object,
  main: React.PropTypes.element,
  footer: React.PropTypes.element,
  sidebar: React.PropTypes.element
};
