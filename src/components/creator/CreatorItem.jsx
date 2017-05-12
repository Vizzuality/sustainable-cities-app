import React from 'react';
import { Select } from 'components/form/Form';
import PropTypes from 'prop-types';

export default class CreatorItem extends React.Component {

  clearDescription() {
    this.input.value = '';
  }

  render() {
    const { options, onAdd, onEdit, selected, description, index } = this.props;
    const _onAdd = (...args) => {
      onAdd(...args);
      this.clearDescription();
    };
    const action = onEdit || _onAdd;


    return (
      <div className="c-creator-item">
        <div className="row expanded">
          <div className="small-6 column">
            <Select value={selected} clearable={false} options={options} onChange={item => action({ id: item.value, description: this.input.value }, index)} />
          </div>
          <div className="small-6 column">
            <input ref={node => this.input = node} defaultValue={description} type="text" onChange={evt => onEdit && onEdit({ description: evt.target.value }, index)} />
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
  selected: PropTypes.string,
  index: PropTypes.number,
  description: PropTypes.string
};

CreatorItem.defaultProps = {
  options: []
};
