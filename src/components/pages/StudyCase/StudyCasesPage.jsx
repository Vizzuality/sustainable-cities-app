import React from 'react';
import { Link } from 'react-router';
import { dispatch } from 'main';
import { getStudyCases } from 'modules/study-cases';
import { connect } from 'react-redux';
import StudyCaseList from 'components/study-case/StudyCaseList';
import Search from 'components/search/Search';
import Spinner from 'components/ui/Spinner';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
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

    // Bindings
    this.scrollListener = this.scrollListener.bind(this);
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
    this._scrollListener = debounce(this.scrollListener, 100);
    window.addEventListener('scroll', this._scrollListener, { passive: true });
  }

  scrollListener() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      if (this.props.studyCases.list.length === this.props.studyCases.itemCount) {
        // We have already get all items, return
        return;
      }
      this.setState({ page: this.state.page + 1 }, () => {
        this.removeScrollListener();
        /*
          TODO: scroll moves at re-rendering and triggers bottom of the page
          many times. Find a better solution
        */
        setTimeout(() => this.setScrollListener(), 500);
      });
    }
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
    this._scrollListener = null;
  }

  render() {
    return (
      <div>
        <Link className="button" to="/study-cases/new">New study case</Link>
        <Search onChange={this.search} />
        <StudyCaseList data={this.props.studyCases.list} />
        <div style={{ position: 'relative', height: '50px' }}>
          <Spinner isLoading={this.props.studyCases.loading} />
        </div>
        {this.props.studyCases.list.length === this.props.studyCases.itemCount &&
          <div>
            <p className="text-center">Theres no more study cases with current filters</p>
          </div>
        }
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
