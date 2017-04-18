import { connect } from 'react-redux';
import BmePage from './BmePage';

const mapStateToProps = ({ bmes }) => ({
  bmes
});

export default connect(mapStateToProps, null)(BmePage);
