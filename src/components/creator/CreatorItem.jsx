import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Autobind } from 'es-decorators';
import { toastr } from 'react-redux-toastr';
import isEqual from 'lodash/isEqual';

// components
import { Select, Button } from 'components/form/Form';

export default class CreatorItem extends React.Component {

  constructor(props) {
    super(props);
    const { category_id, description, is_featured } = props.values || {};

    this.state = {
      is_featured,
      description,
      category_id
    };
  }

  componentWillReceiveProps(nextProps) {
    const { values } = nextProps;

    if (!isEqual(this.props.values, values)) {
      const { category_id, is_featured, description } = values;
      this.setState({
        is_featured,
        description,
        category_id
      });
    }
  }

  onChangeInput(field, value) {
    this.state = {
      ...this.state,
      [field]: value
    };

    this.setState(this.state);
  }

  @Autobind
  onSubmit() {
    this.props.onSubmit(this.state, this.props.index);

    if (!this.props.adder) {
      toastr.success('BME added/edited successfully');
    }

    if (this.props.adder) {
      // resets values
      this.setState({
        is_featured: false,
        description: '',
        category_id: null
      });
    }
  }

  clearDescription() {
    this.input.value = '';
  }

  render() {
    const { options, onDelete, index, deleteable, hidden } = this.props;
    const { category_id, description, is_featured } = this.state;

    const cNames = classNames('c-creator-item', {
      hidden: !!hidden
    });

    return (
      <div className={cNames}>
        <div className="row expanded">
          <div className="small-5 column">
            <Select
              value={category_id} // eslint-disable-line camelcase
              clearable={false}
              options={options}
              onChange={evt => this.setState({ category_id: evt.value })}
            />
          </div>
          <div className="small-5 column">
            <input
              ref={(node) => { this.input = node; }}
              value={description || ''}
              name="description"
              type="text"
              onChange={evt => this.onChangeInput('description', evt.target.value)}
            />

            {deleteable &&
              <button type="button" className="button" onClick={() => onDelete && onDelete(index)}>Delete</button>}
          </div>
          <div className="small-1 column">
            <input
              type="checkbox"
              name="is_featured"
              checked={is_featured || false} // eslint-disable-line camelcase
              onChange={evt => this.onChangeInput('is_featured', evt.target.checked)}
            />
          </div>
          <div className="small-1 column">
            <Button
              className="button"
              type="button"
              disabled={!this.state.category_id}
              onClick={this.onSubmit}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

CreatorItem.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  options: PropTypes.array,
  onDelete: PropTypes.func,
  index: PropTypes.number,
  deleteable: PropTypes.bool,
  hidden: PropTypes.bool,
  values: PropTypes.object,
  adder: PropTypes.bool
};

CreatorItem.defaultProps = {
  options: [],
  values: {}
};
