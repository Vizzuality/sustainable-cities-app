import { get, post, _delete, patch } from 'utils/request';
import {
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_PAGINATION_NUMBER,
  DEFAULT_SORT_FIELD
} from 'constants/bmes';
import { deserialize } from 'utils/json-api';

/* Constants */
const SET_SOLUTIONS = 'SET_SOLUTIONS';
const SET_SOLUTIONS_LOADING = 'SET_SOLUTIONS_LOADING';
const SET_SOLUTIONS_FILTERS = 'SET_SOLUTIONS_FILTERS';
const SET_SOLUTIONS_DETAIL = 'SET_SOLUTIONS_DETAIL';

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
function solutionsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SOLUTIONS:
      return {
        ...state,
        list: action.payload.list,
        itemCount: action.payload.itemCount
      };
    case SET_SOLUTIONS_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case SET_SOLUTIONS_FILTERS:
      return {
        ...state,
        ...action.payload
      };
    case SET_SOLUTIONS_DETAIL:
      return {
        ...state,
        detailId: action.payload
      };
    default:
      return state;
  }
}

/* Action creators */
function setSolutions(data) {
  return {
    type: SET_SOLUTIONS,
    payload: {
      list: data.list,
      itemCount: data.itemCount
    }
  };
}

function setSolutionsLoading(loading) {
  return {
    type: SET_SOLUTIONS_LOADING,
    payload: loading
  };
}

function setFilters(field, value) {
  const filter = {};
  filter[field] = value;

  return {
    type: SET_SOLUTIONS_FILTERS,
    payload: filter
  };
}

function setSolutionsDetail(id) {
  return {
    type: SET_SOLUTIONS_DETAIL,
    payload: id
  };
}

function getSolutions(paramsConfig = {}) {
  return (dispatch) => {
    let { pageSize, pageNumber, sort } = paramsConfig;
    const { onSuccess, id } = paramsConfig;

    pageSize = pageSize || DEFAULT_PAGINATION_SIZE;
    pageNumber = pageNumber || DEFAULT_PAGINATION_NUMBER;
    sort = sort || DEFAULT_SORT_FIELD;

    const url = id ?
      `${config.API_URL}/solutions/${id}` :
      `${config.API_URL}/solutions?page[size]=${pageSize}&page[number]=${pageNumber}&sort=${sort}`;

    dispatch(setSolutionsLoading(true));

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

        dispatch(setSolutionsLoading(false));
        dispatch(setSolutions({ list: parsedData, itemCount: meta.total_items, included }));
        onSuccess && onSuccess();
      }
    });
  };
}

function createSolution({ data, onSuccess }) {
  return (dispatch) => {
    dispatch(setSolutionsLoading(true));
    post({
      url: `${config.API_URL}/solutions`,
      body: { bme: data },
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      },
      onSuccess() {
        dispatch(setSolutionsLoading(false));
        onSuccess && onSuccess();
      }
    });
  };
}

function updateSolution({ id, data, onSuccess }) {
  return (dispatch) => {
    dispatch(setSolutionsLoading(true));
    patch({
      url: `${config.API_URL}/solutions/${id}`,
      body: {
        bme: data
      },
      onSuccess() {
        dispatch(setSolutionsLoading(false));
        onSuccess && onSuccess(id);
      }
    });
  };
}

function deleteSolution({ id, onSuccess }) {
  return (dispatch) => {
    dispatch(setSolutionsLoading(true));
    _delete({
      url: `${config.API_URL}/solutions/${id}`,
      onSuccess() {
        dispatch(setSolutionsLoading(false));
        onSuccess && onSuccess(id);
      }
    });
  };
}

export { solutionsReducer, getSolutions, createSolution, deleteSolution, setSolutionsDetail, updateSolution, setFilters };
