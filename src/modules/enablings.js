import { get } from 'utils/request';
import { deserialize } from 'utils/json-api';

const SET_ENABLINGS = 'SET_ENABLINGS';
const SET_ENABLINGS_LOADING = 'SET_ENABLINGS_LOADING';

/* Initial state */
const initialState = {
  loading: false,
  list: []
};

/* Reducer */
function enablingsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ENABLINGS:
      return {
        ...state,
        list: action.payload
      };
    case SET_ENABLINGS_LOADING: {
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
function setEnablings(categories) {
  return {
    type: SET_ENABLINGS,
    payload: categories
  };
}

function setEnablingsLoading(loading) {
  return {
    type: SET_ENABLINGS_LOADING,
    payload: loading
  };
}

/* Redux-thunk async actions */
function getEnablings() {
  return (dispatch) => {
    dispatch(setEnablingsLoading(true));
    get({
      url: `${config.API_URL}/enablings?page[number]=1&page[size]=999999`,
      onSuccess({ data }) {
        const parsedData = deserialize(data);
        dispatch(setEnablingsLoading(false));
        dispatch(setEnablings(parsedData));
      }
    });
  };
}

export { enablingsReducer, getEnablings };
