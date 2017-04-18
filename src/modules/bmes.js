import { get, post } from 'utils/request';

const SET_BMES = 'SET_BMES';
const SET_BMES_LOADING = 'SET_BMES_LOADING';

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

export { bmesReducer, getBmes, createBme };
