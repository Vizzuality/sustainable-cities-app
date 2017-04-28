import { connect } from 'react-redux';
import Header from './Header';

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps, null)(Header);
