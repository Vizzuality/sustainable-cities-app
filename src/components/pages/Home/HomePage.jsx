import React from 'react';
import { connect } from 'react-redux';

function HomePage(props) {
  return (
    <div>
      <h1>Welcome to Sustainable Cities, <em>{props.user.data ? props.user.data.email : ''}</em></h1>
    </div>
  );
}

HomePage.propTypes = {
  // State
  user: React.PropTypes.object
};

// Map state to props
const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps, null)(HomePage);
