import React from 'react';
import Icon from 'components/ui/Icon';
import classnames from 'classnames';
import { Autobind } from 'es-decorators';
import _debounce from 'lodash/debounce';
import PropTypes from 'prop-types';

export default class Search extends React.Component {

  @Autobind
  clear() {
    this.input.value = '';
    this.input.focus();
    this.props.onChange('');
  }

  render() {
    const { className, onChange, debounce, ...props } = this.props;
    const cNames = classnames('c-search', {
      [className]: !!className
    });

    return (
      <div className={cNames}>
        <input
          ref={(node) => { this.input = node; }}
          className="search-input"
          type="search"
          onChange={_debounce(() => onChange(this.input.value), debounce)}
          {...props}
        />
        <button className="search-btn" onClick={this.clear}>
          <Icon className="search-icon" name="icon-cross" />
        </button>
      </div>
    );
  }
}

Search.propTypes = {
  className: PropTypes.string,
  debounce: PropTypes.number,
  onChange: PropTypes.func
};

Search.defaultProps = {
  placeholder: 'Search',
  onChange: () => {},
  debounce: 300
};
