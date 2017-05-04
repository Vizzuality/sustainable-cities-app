import React from 'react';
import { Link } from 'react-router';
import { dispatch } from 'main';
import { getStudyCases } from 'modules/study-cases';
import { connect } from 'react-redux';
import StudyCaseList from 'components/study-case/StudyCaseList';
import Search from 'components/search/Search';
import Spinner from 'components/ui/Spinner';
import debounce from 'lodash/debounce';

class StudyCasesPage extends React.Component {

  constructor(props) {
    super(props);
    this.page = 1;
  }

  componentWillMount() {
    this.fetchPage();
    this.setScrollListener();
  }

  componentWillUnmount() {
    this.removeScrollListener();
  }

  setScrollListener() {
    this._scrollListener = debounce(() => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        if (this.props.studyCases.list.length === this.props.studyCases.itemCount) {
          // We have already get all items, remove listener then
          this.removeScrollListener();
          return;
        }
        this.page = this.page + 1;
        this.fetchPage();
      }
    }, 100);

    window.addEventListener('scroll', this._scrollListener, { passive: true });
  }

  fetchPage() {
    dispatch(getStudyCases({
      pageNumber: this.page,
      pageSize: 18,
      concat: true
    }));
  }

  removeScrollListener() {
    window.removeEventListener('scroll', this._scrollListener);
  }

  render() {
    return (
      <div>
        <Link className="button" to="/study-cases/new">New study case</Link>
        <Search onChange={val => console.log(val)} />
        <StudyCaseList data={this.props.studyCases.list} />
        <div style={{ position: 'relative' }}>
          <Spinner isLoading={this.props.studyCases.loading} />
        </div>
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
