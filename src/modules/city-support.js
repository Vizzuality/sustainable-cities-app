import { get, post, patch, _delete } from 'utils/request';
import { deserialize } from 'utils/json-api';
import * as queryString from 'query-string';

// constants
import { DEFAULT_PAGINATION_NUMBER, DEFAULT_PAGINATION_SIZE } from 'constants/table';

/* Action types */
const SET_CITY_SUPPORTS = 'SET_CITY_SUPPORTS';
const SET_CITY_SUPPORTS_LOADING = 'SET_CITY_SUPPORTS_LOADING';
const SET_CITY_SUPPORTS_DETAIL = 'SET_CITY_SUPPORTS_DETAIL';
const SET_CITY_SUPPORTS_FILTERS = 'SET_CITY_SUPPORTS_FILTERS';
const SET_CITY_SUPPORTS_SEARCH = 'SET_CITY_SUPPORTS_SEARCH';
const RESET_CITY_SUPPORTS = 'RESET_CITY_SUPPORTS';


/* Initial state */
const initialState = {
  list: [],
  loading: false,
  detailId: null,
  filters: {},
  itemCount: null,
  pagination: {
    pageSize: DEFAULT_PAGINATION_SIZE,
    pageNumber: DEFAULT_PAGINATION_NUMBER
  },
  search: null
};

/* Reducer */
function citySupportReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CITY_SUPPORTS: {
      const { list, itemCount } = action.payload;
      return {
        ...state,
        list,
        itemCount
      };
    }
    case SET_CITY_SUPPORTS_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case SET_CITY_SUPPORTS_DETAIL:
      return {
        ...state,
        detailId: action.payload
      };
    case SET_CITY_SUPPORTS_FILTERS:
      return {
        ...state,
        ...action.payload
      };
    case SET_CITY_SUPPORTS_SEARCH:
      return {
        ...state,
        search: action.payload
      };
    case RESET_CITY_SUPPORTS:
      return {
        ...state,
        list: [],
        pagination: initialState.pagination,
        search: initialState.search
      };
    default:
      return state;
  }
}

/* Action creators */
function setCitySupportLoading(loading) {
  return {
    type: SET_CITY_SUPPORTS_LOADING,
    payload: loading
  };
}

function setCitySupport({ list, itemCount }) {
  return {
    type: SET_CITY_SUPPORTS,
    payload: { list, itemCount }
  };
}

function setCitySupportDetail(id) {
  return {
    type: SET_CITY_SUPPORTS_DETAIL,
    payload: id
  };
}

/* Thunk actions */
const setFilters = (field, value) => {
  const filter = {};
  filter[field] = value;

  return {
    type: SET_CITY_SUPPORTS_FILTERS,
    payload: filter
  };
};

const setCitySupportSearch = (term) => {
  return {
    type: SET_CITY_SUPPORTS_SEARCH,
    payload: term
  };
};

function resetCitySupport() {
  return {
    type: RESET_CITY_SUPPORTS
  };
}

const getCitySupport = ({ pageNumber, pageSize, search, sort, id }) => (dispatch) => {
  const queryS = queryString.stringify({
    'page[size]': pageSize || 999999,
    'page[number]': pageNumber || 1,
    sort: sort || 'name',
    search
  });

  const params = id ? `/${id}` : `?${queryS}`;

  dispatch(setCitySupportLoading(true));
  get({
    url: `${config.API_URL}/city_supports/${params}`,
    onSuccess({ data, meta }) {
      dispatch(setCitySupportLoading(false));

      // Parse data to json api format
      // eslint-disable-next-line no-param-reassign
      if (!Array.isArray(data)) data = [data];
      const parsedData = deserialize(data);

      dispatch(setCitySupport({
        list: parsedData,
        itemCount: meta.total_items
      }));
    }
  });
};

const createCitySupport = ({ data, onSuccess, onError }) => {
  return (dispatch) => {
    dispatch(setCitySupportLoading(true));
    post({
      url: `${config.API_URL}/city_supports`,
      body: { city_support: data },
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      },
      onSuccess() {
        dispatch(setCitySupportLoading(false));
        if (onSuccess) onSuccess();
      },
      onError({ errors = [] }) {
        dispatch(setCitySupportLoading(false));
        if (onError && errors[0]) onError(errors[0]);
      }
    });
  };
};

const updateCitySupport = ({ id, data, onSuccess, onError }) => {
  return (dispatch) => {
    dispatch(setCitySupportLoading(true));
    patch({
      url: `${config.API_URL}/city_supports/${id}`,
      body: { city_support: data },
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      },
      onSuccess() {
        dispatch(setCitySupportLoading(false));
        if (onSuccess) onSuccess(id);
      },
      onError({ errors = [] }) {
        dispatch(setCitySupportLoading(false));
        if (onError && errors[0]) onError(errors[0]);
      }
    });
  };
};


const deleteCitySupport = ({ id, onSuccess }) => {
  return (dispatch) => {
    dispatch(setCitySupportLoading(true));
    _delete({
      url: `${config.API_URL}/city_supports/${id}`,
      onSuccess() {
        dispatch(setCitySupportLoading(false));
        if (onSuccess) onSuccess(id);
      }
    });
  };
};


export {
  citySupportReducer,
  getCitySupport,
  setCitySupportDetail,
  deleteCitySupport,
  setFilters,
  setCitySupportSearch,
  resetCitySupport,
  createCitySupport,
  updateCitySupport
};
