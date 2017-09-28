import { get, post, patch, _delete } from 'utils/request';
import { deserialize } from 'utils/json-api';
import * as queryString from 'query-string';

// constants
import { DEFAULT_PAGINATION_NUMBER, DEFAULT_PAGINATION_SIZE } from 'constants/table';

/* Action types */
const SET_CITIES = 'SET_CITIES';
const SET_CITIES_LOADING = 'SET_CITIES_LOADING';
const SET_CITY_DETAIL = 'SET_CITY_DETAIL';
const SET_CITY_FILTERS = 'SET_CITY_FILTERS';
const SET_CITY_SEARCH = 'SET_CITY_SEARCH';
const RESET_CITIES = 'RESET_CITIES';

// helper
const getCityPhoto = (city, include = []) => {
  const photos = include.filter(inc => inc.type === 'photos') || [];
  const photoAttributes = deserialize(photos)[0] || {};
  return { photos_attributes: [photoAttributes] };
};


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
function citiesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CITIES: {
      const { list, itemCount } = action.payload;
      return {
        ...state,
        list,
        itemCount
      };
    }
    case SET_CITIES_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case SET_CITY_DETAIL:
      return {
        ...state,
        detailId: action.payload
      };
    case SET_CITY_FILTERS:
      return {
        ...state,
        ...action.payload
      };
    case SET_CITY_SEARCH:
      return {
        ...state,
        search: action.payload
      };
    case RESET_CITIES:
      return {
        ...state,
        list: initialState.list,
        pagination: initialState.pagination,
        search: initialState.search
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

function setCities({ list, itemCount }) {
  return {
    type: SET_CITIES,
    payload: { list, itemCount }
  };
}

function setCityDetail(id) {
  return {
    type: SET_CITY_DETAIL,
    payload: id
  };
}

/* Thunk actions */
const setFilters = (field, value) => {
  const filter = {};
  filter[field] = value;

  return {
    type: SET_CITY_FILTERS,
    payload: filter
  };
};

const setCitySearch = (term) => {
  return {
    type: SET_CITY_SEARCH,
    payload: term
  };
};

function resetCities() {
  return {
    type: RESET_CITIES
  };
}

const getCities = ({ pageNumber, pageSize, search, sort, id }) => (dispatch) => {
  const queryS = queryString.stringify({
    'page[size]': pageSize || 999999,
    'page[number]': pageNumber || 1,
    sort: sort || 'name',
    search
  });

  const params = id ? `/${id}` : `?${queryS}`;

  dispatch(setCitiesLoading(true));
  get({
    url: `${config.API_URL}/cities${params}`,
    onSuccess({ data, meta, included }) {
      dispatch(setCitiesLoading(false));

      // Parse data to json api format
      // eslint-disable-next-line no-param-reassign
      if (!Array.isArray(data)) data = [data];
      const parsedData = deserialize(data);

      dispatch(setCities({
        list: parsedData.map(city => ({
          ...city,
          countryId: city.relationships.country.data.id,
          ...city.relationships.photos.data.length && getCityPhoto(city, included)
        })),
        itemCount: meta.total_items
      }));
    }
  });
};

const createCity = ({ data, onSuccess, onError }) => {
  return (dispatch) => {
    dispatch(setCitiesLoading(true));
    post({
      url: `${config.API_URL}/cities`,
      body: { city: data },
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      },
      onSuccess() {
        dispatch(setCitiesLoading(false));
        if (onSuccess) onSuccess();
      },
      onError({ errors = [] }) {
        dispatch(setCitiesLoading(false));
        if (onError && errors[0]) onError(errors[0]);
      }
    });
  };
};

const updateCity = ({ id, data, onSuccess, onError }) => {
  return (dispatch) => {
    dispatch(setCitiesLoading(true));
    patch({
      url: `${config.API_URL}/cities/${id}`,
      body: { city: data },
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      },
      onSuccess() {
        dispatch(setCitiesLoading(false));
        if (onSuccess) onSuccess(id);
      },
      onError({ errors = [] }) {
        dispatch(setCitiesLoading(false));
        if (onError && errors[0]) onError(errors[0]);
      }
    });
  };
};


const deleteCity = ({ id, onSuccess }) => {
  return (dispatch) => {
    dispatch(setCitiesLoading(true));
    _delete({
      url: `${config.API_URL}/cities/${id}`,
      onSuccess() {
        dispatch(setCitiesLoading(false));
        if (onSuccess) onSuccess(id);
      }
    });
  };
};


export { citiesReducer, getCities, setCityDetail, deleteCity, setFilters, setCitySearch, resetCities, createCity, updateCity };
