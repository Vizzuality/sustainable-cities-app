import React from 'react';

export default function HomePage(props) {
  return <h1>Welcome to Sustainable Cities, <em>{props.user.data ? props.user.data.email : ''}</em></h1>;
}

HomePage.propTypes = {
  user: React.PropTypes.object
};
