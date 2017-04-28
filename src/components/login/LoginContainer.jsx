import { connect } from 'react-redux';
import Login from './Login';

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps, null)(Login);
