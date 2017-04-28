import React from 'react';
import { connect } from 'react-redux';

function HomePage(props) {
  return (
    <div>
      <p>Welcome to Sustainable Cities, <strong>{props.user.data ? props.user.data.email : ''}</strong></p>
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
