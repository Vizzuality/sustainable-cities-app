import { connect } from 'react-redux';
import HomePage from './HomePage';

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps, null)(HomePage);
