import React from 'react';
import { Link } from 'react-router';
import { getBmes } from 'modules/bmes';
import { dispatch } from 'main';
import Spinner from 'components/ui/Spinner';
import Table from 'components/ui/Table';

export default class BmePage extends React.Component {

  componentWillMount() {
    // Fetch Bems
    dispatch(getBmes());
  }

  render() {
    return (
      <div>
        <Link className="c-btn -primary" to="/business-model-element/new">New Business Model Element</Link>
        <Table
          items={this.props.bmes.list}
          fields={['name', 'description']}
          defaultSort="name"
          sortableBy={['name']}
        />
        <Spinner isLoading={this.props.bmes.loading} />
      </div>
    );
  }
}

BmePage.propTypes = {
  bmes: React.PropTypes.object
};
