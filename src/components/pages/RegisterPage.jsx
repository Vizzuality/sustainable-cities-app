import React from 'react';
import Register from 'components/register/Register';

export default class RegisterPage extends React.Component {
  render() {
    return (
      <div>
        <div className="login-wrapper">
          <Register />
        </div>
      </div>
    );
  }
}
