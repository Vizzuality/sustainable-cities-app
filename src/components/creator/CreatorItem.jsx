import React from 'react';
import { Select } from 'components/form/Form';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class CreatorItem extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      is_featured: props.is_featured
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      is_featured: nextProps.is_featured
    });
  }

  onChangeInput(field, value) {
    this.state = {
      ...this.state,
      [field]: value
    };

    this.setState(this.state);

    if (this.props.onEdit) {
      this.props.onEdit(this.state, this.props.index);
    }
  }

  clearDescription() {
    this.input.value = '';
  }

  render() {
    const {
      options,
      onAdd,
      onEdit,
      onDelete,
      selected,
      description,
      index,
      deleteable,
      hidden,
      selectedField
    } = this.props;

    const { is_featured } = this.state;

    const customOnAdd = (...args) => {
      onAdd(...args);
      this.clearDescription();
    };

    const action = onEdit || customOnAdd;
    const cNames = classNames('c-creator-item',
      {
        hidden: !!hidden
      });

    return (
      <div className={cNames}>
        <div className="row expanded">
          <div className="small-5 column">
            <Select
              value={selected}
              clearable={false}
              options={options}
              onChange={item => action({
                ...this.state,
                [selectedField]: item.value,
                description: this.input.value
              }, index)}
            />
          </div>
          <div className="small-5 column">
            <input
              ref={(node) => { this.input = node; }}
              value={description || ''}
              type="text"
              onChange={evt => onEdit && onEdit({ description: evt.target.value }, index)}
            />

            {deleteable &&
              <button type="button" className="button" onClick={() => onDelete && onDelete(index)}>Delete</button>}
          </div>
          <div className="small-2 column">
            <input
              type="checkbox"
              name="is_featured"
              checked={is_featured || false} // eslint-disable-line camelcase
              onChange={evt => this.onChangeInput('is_featured', evt.target.checked)}
            />
          </div>
        </div>
      </div>
    );
  }
}
CreatorItem.propTypes = {
  options: PropTypes.array,
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  selected: PropTypes.string,
  selectedField: PropTypes.string,
  index: PropTypes.number,
  is_featured: PropTypes.bool,
  description: PropTypes.string,
  deleteable: PropTypes.bool,
  hidden: PropTypes.bool
};

CreatorItem.defaultProps = {
  options: [],
  is_featured: false
};
