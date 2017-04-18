import { connect } from 'react-redux';
import Register from './Register';

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps, null)(Register);
