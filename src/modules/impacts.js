import { get, post, _delete, patch } from 'utils/request';
import {
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_PAGINATION_NUMBER,
  DEFAULT_SORT_FIELD
} from 'constants/impacts';
import { deserialize } from 'utils/json-api';

/* Constants */
const SET_IMPACT = 'SET_IMPACT';
const SET_IMPACT_LOADING = 'SET_IMPACT_LOADING';
const SET_IMPACT_FILTERS = 'SET_IMPACT_FILTERS';
const SET_IMPACT_DETAIL = 'SET_IMPACT_DETAIL';

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
function impactReducer(state = initialState, action) {
  switch (action.type) {
    case SET_IMPACT:
      return {
        ...state,
        list: action.payload.list,
        itemCount: action.payload.itemCount
      };
    case SET_IMPACT_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case SET_IMPACT_FILTERS:
      return {
        ...state,
        ...action.payload
      };
    case SET_IMPACT_DETAIL:
      return {
        ...state,
        detailId: action.payload
      };
    default:
      return state;
  }
}

/* Action creators */
function setImpacts(data) {
  return {
    type: SET_IMPACT,
    payload: {
      list: data.list,
      itemCount: data.itemCount
    }
  };
}

function setImpactLoading(loading) {
  return {
    type: SET_IMPACT_LOADING,
    payload: loading
  };
}

function setFilters(field, value) {
  const filter = {};
  filter[field] = value;

  return {
    type: SET_IMPACT_FILTERS,
    payload: filter
  };
}

function setImpactDetail(id) {
  return {
    type: SET_IMPACT_DETAIL,
    payload: id
  };
}

function getImpacts(paramsConfig = {}) {
  return (dispatch) => {
    let { pageSize, pageNumber, sort } = paramsConfig;
    const { onSuccess, id } = paramsConfig;

    pageSize = pageSize || DEFAULT_PAGINATION_SIZE;
    pageNumber = pageNumber || DEFAULT_PAGINATION_NUMBER;
    sort = sort || DEFAULT_SORT_FIELD;

    const url = id ?
      `${config.API_URL}/impacts/${id}` :
      `${config.API_URL}/impacts?page[size]=${pageSize}&page[number]=${pageNumber}&sort=${sort}`;

    dispatch(setImpactLoading(true));

    get({
      url,
      onSuccess({ data, meta, included }) {
        // Parse data to json api format
        if (!Array.isArray(data)) {
          data = [data];
        }

        let parsedData = deserialize(data);
        if (included) {
          parsedData = [({ ...parsedData[0], ...{ included: deserialize(included) } })];
        }

        dispatch(setImpactLoading(false));
        dispatch(setImpacts({ list: parsedData, itemCount: meta.total_items, included }));
        onSuccess && onSuccess();
      }
    });
  };
}

function createImpact({ data, onSuccess }) {
  return (dispatch) => {
    dispatch(setImpactLoading(true));
    post({
      url: `${config.API_URL}/impacts`,
      body: { bme: data },
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      },
      onSuccess() {
        dispatch(setImpactLoading(false));
        onSuccess && onSuccess();
      }
    });
  };
}

function updateImpact({ id, data, onSuccess }) {
  return (dispatch) => {
    dispatch(setImpactLoading(true));
    patch({
      url: `${config.API_URL}/impacts/${id}`,
      body: {
        bme: data
      },
      onSuccess() {
        dispatch(setImpactLoading(false));
        onSuccess && onSuccess(id);
      }
    });
  };
}

function deleteImpact({ id, onSuccess }) {
  return (dispatch) => {
    dispatch(setImpactLoading(true));
    _delete({
      url: `${config.API_URL}/impacts/${id}`,
      onSuccess() {
        dispatch(setImpactLoading(false));
        onSuccess && onSuccess(id);
      }
    });
  };
}

export { impactReducer, getImpacts, createImpact, deleteImpact, setImpactDetail, updateImpact, setFilters };
