import { get } from 'utils/request';
import { deserialize } from 'utils/json-api';
import * as queryString from 'query-string';

/* Action types */
const SET_CITIES = 'SET_CITIES';
const SET_CITIES_LOADING = 'SET_CITIES_LOADING';

/* Initial state */
const initialState = {
  list: [],
  loading: false
};

/* Reducer */
function citiesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CITIES:
      return {
        ...state,
        list: action.payload
      };
    case SET_CITIES_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
}

/* Action creators */
function setCitiesLoading(loading) {
  return {
    type: SET_CITIES_LOADING,
    payload: loading
  };
}

function setCities(cities) {
  return {
    type: SET_CITIES,
    payload: cities
  };
}

/* Thunk actions */
const getCities = ({ pageNumber, pageSize, search, sort }) => (dispatch) => {
  const queryS = queryString.stringify({
    'page[size]': pageSize || 999999,
    'page[number]': pageNumber || 1,
    sort: sort || 'name',
    search
  });

  dispatch(setCitiesLoading(true));
  get({
    url: `${config.API_URL}/cities?${queryS}`,
    onSuccess({ data }) {
      dispatch(setCitiesLoading(false));
      dispatch(setCities(deserialize(data)));
    }
  });
};


export { citiesReducer, getCities };
