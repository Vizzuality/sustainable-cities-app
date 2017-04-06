import { connect } from 'react-redux';
import Login from './Login';

const mapStateToProps = ({ login }) => ({
  login
});

export default connect(mapStateToProps, null)(Login);
