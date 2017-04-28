import React from 'react';
import Login from 'components/login/LoginContainer';

export default class LoginPage extends React.Component {
  render() {
    return (
      <div>
        <div className="login-wrapper">
          <Login />
        </div>
      </div>
    );
  }
}
