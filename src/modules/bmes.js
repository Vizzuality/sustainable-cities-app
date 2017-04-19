import { get, post, _delete } from 'utils/request';
import findIndex from 'lodash/findIndex';

const SET_BMES = 'SET_BMES';
const SET_BMES_LOADING = 'SET_BMES_LOADING';
const REMOVE_BEM = 'REMOVE_BEM';

/* Initial state */
const initialState = {
  loading: false,
  list: []
};

/* Reducer */
function bmesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_BMES:
      return {
        ...state,
        list: action.payload
      };
    case REMOVE_BEM: {
      const index = findIndex(state.list, item => item.id === action.payload);
      const list = state.list.slice(0);
      list.splice(index, 1);

      return {
        ...state,
        list
      };
    }
    case SET_BMES_LOADING: {
      return {
        ...state,
        loading: action.payload
      };
    }
    default:
      return state;
  }
}

/* Action creators */
function setBmes(categories) {
  return {
    type: SET_BMES,
    payload: categories
  };
}

function removeBem(id) {
  return {
    type: REMOVE_BEM,
    payload: id
  };
}

function setBmesLoading(loading) {
  return {
    type: SET_BMES_LOADING,
    payload: loading
  };
}

/* Redux-thunk async actions */
function getBmes() {
  return (dispatch) => {
    dispatch(setBmesLoading(true));
    get({
      url: `${config.API_URL}/business-model-elements`,
      onSuccess({ data }) {
        dispatch(setBmesLoading(false));
        dispatch(setBmes(data));
      }
    });
  };
}

function createBme({ data, onSuccess }) {
  return (dispatch) => {
    dispatch(setBmesLoading(true));
    post({
      url: `${config.API_URL}/business-model-elements`,
      body: data,
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      },
      onSuccess() {
        dispatch(setBmesLoading(false));
        onSuccess && onSuccess();
      }
    });
  };
}

function deleteBme({ id, onSuccess }) {
  return (dispatch) => {
    dispatch(setBmesLoading(true));
    _delete({
      url: `${config.API_URL}/business-model-elements/${id}`,
      onSuccess() {
        dispatch(removeBem(id));
        dispatch(setBmesLoading(false));
        onSuccess && onSuccess(id);
      }
    });
  };
}

export { bmesReducer, getBmes, createBme, deleteBme };
