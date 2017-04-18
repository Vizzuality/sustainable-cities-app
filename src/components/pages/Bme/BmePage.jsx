import React from 'react';
import { Link } from 'react-router';
import { getBmes } from 'modules/bmes';
import { dispatch } from 'main';
import Spinner from 'components/ui/Spinner';

export default class BmePage extends React.Component {

  componentWillMount() {
    // Fetch Bems
    dispatch(getBmes());
  }

  render() {
    return (
      <div>
        <Link className="c-btn -primary" to="/business-model-element/new">New Business Model Element</Link>
        <ul>
          {this.props.bmes.list.map((bme, i) => <li key={i}>{bme.attributes.name}</li>)}
        </ul>
        <Spinner isLoading={this.props.bmes.loading} />
      </div>
    );
  }
}

BmePage.propTypes = {
  bmes: React.PropTypes.object
};
