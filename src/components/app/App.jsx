import React from 'react';
import { dispatch } from 'main';
import { getUserData } from 'modules/user';

export default class App extends React.Component {

  componentWillMount() {
    if (this.props.user.logged && !this.props.user.data) {
      dispatch(getUserData());
    }
  }

  render() {
    return (
      <div>
        {this.props.header}
        <main role="main" className="l-main">
          <div className="main-content l-app-wrapper">
            {this.props.main}
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
  header: React.PropTypes.element
};
