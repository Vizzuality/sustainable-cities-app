import { connect } from 'react-redux';
import NewBmePage from './NewBmePage';

const mapStateToProps = ({ user, categories }) => ({
  user,
  categories
});

export default connect(mapStateToProps, null)(NewBmePage);
