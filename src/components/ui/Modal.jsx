import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/ui/Icon';
import { dispatch } from 'main';
import { setModalChildren, toggleModal } from 'modules/modal';
import classnames from 'classnames';
import { connect } from 'react-redux';

class Modal extends React.Component {

  componentDidMount() {
    this.el.addEventListener('transitionend', () => {
      if (!this.props.opened) {
        dispatch(setModalChildren(null));
      }
    });
  }

  // Close modal when esc key is pressed
  componentWillReceiveProps({ opened }) {
    function escKeyPressListener(evt) {
      document.removeEventListener('keydown', escKeyPressListener);
      return evt.keyCode === 27 && dispatch(toggleModal(false));
    }
    // if opened property has changed
    if (this.props.opened !== opened) {
      document[opened ? 'addEventListener' : 'removeEventListener']('keydown', escKeyPressListener);
    }
  }

  render() {
    const cNames = classnames('c-modal', {
      '-hidden': !this.props.opened
    });
    return (
      <section ref={(node) => { this.el = node; }} className={cNames}>
        <div className="modal-container">
          <button className="modal-close" onClick={() => dispatch(toggleModal(false))}>
            <Icon name="icon-cross" className="-big" />
          </button>
          <div className="modal-content">
            {this.props.children}
          </div>
        </div>
        { // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        } <div className="modal-backdrop" onClick={() => dispatch(toggleModal(false))} />
      </section>
    );
  }
}

Modal.propTypes = {
  // STORE
  opened: PropTypes.bool,
  children: PropTypes.any
};

Modal.defaultProps = {
  opened: false,
  children: null
};

// Map state to props
const mapStateToProps = state => ({
  opened: state.modal.opened,
  children: state.modal.children
});

export default connect(mapStateToProps, null)(Modal);
