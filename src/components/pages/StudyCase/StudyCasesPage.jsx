import React from 'react';
import { Link } from 'react-router';
import { dispatch } from 'main';
import { getStudyCases } from 'modules/study-cases';
import { connect } from 'react-redux';
import StudyCaseList from 'components/study-case/StudyCaseList';
import Search from 'components/search/Search';
import Spinner from 'components/ui/Spinner';
import debounce from 'lodash/debounce';
import { Autobind } from 'es-decorators';


function fetchPage(pageNumber, search, concat) {
  dispatch(getStudyCases({
    pageNumber,
    pageSize: 18,
    concat,
    search
  }));
}

class StudyCasesPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      search: ''
    };
  }

  componentWillMount() {
    fetchPage();
    this.setScrollListener();
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.page !== nextState.page) {
      fetchPage(nextState.page, nextState.search, this.state.search === nextState.search);
      return;
    }

    if (this.state.search !== nextState.search) {
      fetchPage(1, nextState.search, false);
    }
  }

  componentWillUnmount() {
    this.removeScrollListener();
  }

  setScrollListener() {
    this._scrollListener = debounce(() => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        if (this.props.studyCases.list.length === this.props.studyCases.itemCount) {
          // We have already get all items, return
          return;
        }
        this.setState({ page: this.state.page + 1 });
      }
    }, 100);

    window.addEventListener('scroll', this._scrollListener);
  }

  @Autobind
  search(val) {
    this.setState({
      search: val.toLowerCase(),
      page: 1
    });
  }

  removeScrollListener() {
    window.removeEventListener('scroll', this._scrollListener);
  }

  render() {
    return (
      <div>
        <Link className="button" to="/study-cases/new">New study case</Link>
        <Search onChange={this.search} />
        <StudyCaseList data={this.props.studyCases.list} />
        <Spinner className="-fixed" isLoading={this.props.studyCases.loading} />
      </div>
    );
  }
}

StudyCasesPage.propTypes = {
  studyCases: React.PropTypes.object
};

// Map state to props
const mapStateToProps = ({ studyCases }) => ({
  studyCases
});

export default connect(mapStateToProps, null)(StudyCasesPage);
