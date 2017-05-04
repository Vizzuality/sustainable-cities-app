/* Constants */
const MODAL_TOGGLE = 'MODAL_TOGGLE';
const MODAL_SET_CHILDREN = 'MODAL_SET_CHILDREN';

/* Initial state */
const initialState = {
  opened: false,
  children: null
};

/* Reducer */
function modalReducer(state = initialState, action) {
  switch (action.type) {
    case MODAL_TOGGLE: {
      const { opened, children } = action.payload;
      const newState = {
        ...state,
        opened
      };
      if (children) newState.children = children;
      return newState;
    }
    case MODAL_SET_CHILDREN:
      return {
        ...state,
        children: action.payload
      };
    default:
      return state;
  }
}

/* Action creators */
function setModalChildren(children) {
  return {
    type: MODAL_SET_CHILDREN,
    payload: children
  };
}

function toggleModal(opened, children) {
  const payload = { opened };
  if (children) payload.children = children;
  return {
    type: MODAL_TOGGLE,
    payload
  };
}

export { modalReducer, setModalChildren, toggleModal };
