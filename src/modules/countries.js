import { get } from 'utils/request';
import { deserialize } from 'utils/json-api';
import * as queryString from 'query-string';

/* Action types */
const SET_COUNTRIES = 'SET_COUNTRIES';
const SET_COUNTRIES_LOADING = 'SET_COUNTRIES_LOADING';

/* Initial state */
const initialState = {
  list: [],
  loading: false
};

/* Reducer */
function countriesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_COUNTRIES: {
      return {
        ...state,
        list: action.payload
      };
    }
    case SET_COUNTRIES_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
}

/* Action creators */
function setCOuntriesLoading(loading) {
  return {
    type: SET_COUNTRIES_LOADING,
    payload: loading
  };
}

function setCountries(countries) {
  return {
    type: SET_COUNTRIES,
    payload: countries
  };
}

/* Thunk actions */
const getCountries = () => (dispatch) => {
  const queryS = queryString.stringify({
    'page[size]': 9999,
    sort: 'name'
  });

  dispatch(setCOuntriesLoading(true));
  get({
    url: `${config.API_URL}/countries?${queryS}`,
    onSuccess({ data }) {
      dispatch(setCOuntriesLoading(false));
      let parsedData = data;

      // Parse data to json api format
      if (!Array.isArray(parsedData)) parsedData = [data];
      parsedData = deserialize(data);

      dispatch(setCountries(parsedData));
    }
  });
};

export { countriesReducer, getCountries };
