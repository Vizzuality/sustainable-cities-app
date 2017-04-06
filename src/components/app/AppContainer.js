import { connect } from 'react-redux';
import App from './App';

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps, null)(App);
