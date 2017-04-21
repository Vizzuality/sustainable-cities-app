import { get, post, _delete, patch } from 'utils/request';
import {
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_PAGINATION_NUMBER,
  DEFAULT_SORT_FIELD
} from 'constants/bmes';

/* Constants */
const SET_BMES = 'SET_BMES';
const SET_BMES_LOADING = 'SET_BMES_LOADING';
const SET_BMES_FILTERS = 'SET_BMES_FILTERS';
const SET_BMES_DETAIL = 'SET_BMES_DETAIL';


/* Initial state */
const initialState = {
  loading: false,
  list: [],
  detailId: null,
  filters: {},
  pagination: {
    pageSize: DEFAULT_PAGINATION_SIZE,
    pageNumber: DEFAULT_PAGINATION_NUMBER
  }
};

/* Reducer */
function bmesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_BMES:
      return {
        ...state,
        list: action.payload
      };
    case SET_BMES_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case SET_BMES_FILTERS:
      return {
        ...state,
        ...action.payload
      };
    case SET_BMES_DETAIL:
      return {
        ...state,
        detailId: action.payload
      };
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

function setFilters(field, value) {
  const filter = {};
  filter[field] = value;

  return {
    type: SET_BMES_FILTERS,
    payload: filter
  };
}

function setBmesDetail(id) {
  return {
    type: SET_BMES_DETAIL,
    payload: id
  };
}

/* Redux-thunk async actions */
function getBmes(paramsConfig = {}) {
  return (dispatch) => {
    let { pageSize, pageNumber, sort, id } = paramsConfig;
    id = id ? `/${id}` : '';
    pageSize = pageSize || DEFAULT_PAGINATION_SIZE;
    pageNumber = pageNumber || DEFAULT_PAGINATION_NUMBER;
    sort = sort || DEFAULT_SORT_FIELD;

    dispatch(setBmesLoading(true));
    const url = `${config.API_URL}/business-model-elements${id}?
      page[size]=${pageSize}&page[number]=${pageNumber}&sort=${sort}`;

    get({
      url,
      onSuccess({ data }) {
        // Parse data to json api format
        if (!Array.isArray(data)) {
          data = [data];
        }

        const parsedData = data.map((item) => {
          const { attributes, ...props } = item;
          return { ...attributes, ...props };
        });

        dispatch(setBmesLoading(false));
        dispatch(setBmes(parsedData));
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

function updateBme({ id, data, onSuccess }) {
  return (dispatch) => {
    dispatch(setBmesLoading(true));
    patch({
      url: `${config.API_URL}/business-model-elements/${id}`,
      body: {
        'bme': data
      },
      onSuccess() {
        dispatch(setBmesLoading(false));
        onSuccess && onSuccess(id);
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
        dispatch(setBmesLoading(false));
        onSuccess && onSuccess(id);
      }
    });
  };
}

export { bmesReducer, getBmes, createBme, deleteBme, setBmesDetail, updateBme, setFilters };
