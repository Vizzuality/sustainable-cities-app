import React from 'react';
import { Select } from 'components/form/Form';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class CreatorItem extends React.Component {

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

    const _onAdd = (...args) => {
      onAdd(...args);
      this.clearDescription();
    };

    const action = onEdit || _onAdd;
    const cNames = classNames('c-creator-item',
      {
        hidden: !!hidden
      });

    return (
      <div className={cNames}>
        <div className="row expanded">
          <div className="small-6 column">
            <Select value={selected} clearable={false} options={options} onChange={item => action({ [selectedField]: item.value, description: this.input.value }, index)} />
          </div>
          <div className="small-6 column">
            <input ref={node => this.input = node} defaultValue={description} type="text" onChange={evt => onEdit && onEdit({ description: evt.target.value }, index)} />
            {deleteable && <button type="button" className="button" onClick={() => onDelete && onDelete(index)}>Delete</button>}
          </div>
          <div className="small-6 column" />
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
  description: PropTypes.string,
  deleteable: PropTypes.bool,
  hidden: PropTypes.bool
};

CreatorItem.defaultProps = {
  options: []
};
