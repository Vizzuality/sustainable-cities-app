import { get, post, _delete } from 'utils/request';
import { deserialize } from 'utils/json-api';

import {
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_PAGINATION_NUMBER,
  DEFAULT_SORT_FIELD
} from 'constants/enablings';

const SET_ENABLINGS = 'SET_ENABLINGS';
const SET_ENABLINGS_LOADING = 'SET_ENABLINGS_LOADING';
const SET_ENABLINGS_FILTERS = 'SET_ENABLINGS_FILTERS';
const SET_ENABLINGS_CATEGORIES = 'SET_ENABLINGS_CATEGORIES';

/* Initial state */
const initialState = {
  loading: false,
  list: [],
  itemCount: null,
  detailId: null,
  filters: {},
  pagination: {
    pageSize: DEFAULT_PAGINATION_SIZE,
    pageNumber: DEFAULT_PAGINATION_NUMBER
  },
  categories: []
};

/* Reducer */
function enablingsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ENABLINGS:
      return {
        ...state,
        list: action.payload.list,
        itemCount: action.payload.itemCount
      };
    case SET_ENABLINGS_LOADING: {
      return {
        ...state,
        loading: action.payload
      };
    }
    case SET_ENABLINGS_FILTERS:
      return {
        ...state,
        ...action.payload
      };
    case SET_ENABLINGS_CATEGORIES:
      return {
        ...state,
        categories: action.payload
      };
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

function setCategories(categories) {
  return {
    type: SET_ENABLINGS_CATEGORIES,
    payload: categories
  };
}

function setEnablingsLoading(loading) {
  return {
    type: SET_ENABLINGS_LOADING,
    payload: loading
  };
}

function setFilters(field, value) {
  const filter = {};
  filter[field] = value;

  return {
    type: SET_ENABLINGS_FILTERS,
    payload: filter
  };
}

/* Redux-thunk async actions */
function getEnablings(paramsConfig = {}) {
  let { pageSize, pageNumber, sort } = paramsConfig;
  const { id } = paramsConfig;

  pageSize = pageSize || DEFAULT_PAGINATION_SIZE;
  pageNumber = pageNumber || DEFAULT_PAGINATION_NUMBER;
  sort = sort || DEFAULT_SORT_FIELD;

  const url = id ?
    `${config.API_URL}/enablings/${id}` :
    `${config.API_URL}/enablings?page[size]=${pageSize}&page[number]=${pageNumber}&sort=${sort}`;

  return (dispatch) => {
    dispatch(setEnablingsLoading(true));
    get({
      url,
      onSuccess({ data, meta }) {
        const parsedData = deserialize(data);
        dispatch(setEnablingsLoading(false));
        dispatch(setEnablings({ list: parsedData, itemCount: meta.total_items }));
      }
    });
  };
}

function getCategories() {
  return (dispatch) => {
    dispatch(setEnablingsLoading(true));
    get({
      url: `${config.API_URL}/enabling-categories?page[number]=1&page[size]=999999`,
      onSuccess({ data }) {
        const parsedData = deserialize(data);
        dispatch(setEnablingsLoading(false));
        dispatch(setCategories(parsedData));
      }
    });
  };
}

function deleteEnabling({ id, onSuccess }) {
  return (dispatch) => {
    dispatch(setEnablingsLoading(true));
    _delete({
      url: `${config.API_URL}/enablings/${id}`,
      onSuccess() {
        dispatch(setEnablingsLoading(false));
        onSuccess && onSuccess(id);
      }
    });
  };
}

function createEnabling({ data, onSuccess }) {
  return (dispatch) => {
    dispatch(setEnablingsLoading(true));
    post({
      url: `${config.API_URL}/enablings`,
      body: data,
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      },
      onSuccess() {
        dispatch(setEnablingsLoading(false));
        onSuccess && onSuccess();
      }
    });
  };
}

export { enablingsReducer, getEnablings, deleteEnabling, createEnabling, getCategories, setFilters };
