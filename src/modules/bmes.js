import { get, post, _delete, patch } from 'utils/request';
import {
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_PAGINATION_NUMBER,
  DEFAULT_SORT_FIELD
} from 'constants/bmes';
import { deserialize } from 'utils/json-api';

/* Constants */
const SET_BMES = 'SET_BMES';
const SET_BMES_LOADING = 'SET_BMES_LOADING';
const SET_BMES_FILTERS = 'SET_BMES_FILTERS';
const SET_BMES_DETAIL = 'SET_BMES_DETAIL';

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
  }
};

/* Reducer */
function bmesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_BMES:
      return {
        ...state,
        list: action.payload.list,
        itemCount: action.payload.itemCount
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
function setBmes(data) {
  return {
    type: SET_BMES,
    payload: {
      list: data.list,
      itemCount: data.itemCount
    }
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

function getBmes(paramsConfig = {}) {
  return (dispatch) => {
    let { pageSize, pageNumber, sort } = paramsConfig;
    const { onSuccess, id } = paramsConfig;

    pageSize = pageSize || DEFAULT_PAGINATION_SIZE;
    pageNumber = pageNumber || DEFAULT_PAGINATION_NUMBER;
    sort = sort || DEFAULT_SORT_FIELD;

    const url = id ?
      `${config.API_URL}/business-model-elements/${id}` :
      `${config.API_URL}/business-model-elements?page[size]=${pageSize}&page[number]=${pageNumber}&sort=${sort}`;

    dispatch(setBmesLoading(true));

    get({
      url,
      onSuccess({ data, meta, included }) {
        console.log(data)
        // Parse data to json api format
        if (!Array.isArray(data)) {
          data = [data];
        }

        let parsedData = deserialize(data);
        if (included) {
          parsedData = parsedData.map((d, i) => ({ ...d, ...{ included: deserialize([included[i]]) } }));
        }

        dispatch(setBmesLoading(false));
        dispatch(setBmes({ list: parsedData, itemCount: meta.total_items, included }));
        onSuccess && onSuccess();
      }
    });
  };
}

function createBme({ data, onSuccess }) {
  return (dispatch) => {
    dispatch(setBmesLoading(true));
    post({
      url: `${config.API_URL}/business-model-elements`,
      body: { bme: data },
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
        bme: data
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
