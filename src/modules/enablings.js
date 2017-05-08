import { get, post, _delete, patch } from 'utils/request';
import { push } from 'react-router-redux';
import { toastr } from 'react-redux-toastr';
import { deserialize } from 'utils/json-api';
import { getIdRelations } from 'utils/relation';
import * as queryString from 'query-string';

import { DEFAULT_SORT_FIELD } from 'constants/enablings';
import { DEFAULT_PAGINATION_NUMBER, DEFAULT_PAGINATION_SIZE } from 'constants/table';

const SET_ENABLINGS = 'SET_ENABLINGS';
const SET_ENABLINGS_SEARCH = 'SET_ENABLINGS_SEARCH';
const SET_ENABLINGS_LOADING = 'SET_ENABLINGS_LOADING';
const SET_ENABLINGS_FILTERS = 'SET_ENABLINGS_FILTERS';
const SET_ENABLINGS_DETAIL = 'SET_ENABLINGS_DETAIL';
const RESET_ENABLINGS = 'RESET_ENABLINGS';

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
        included: action.payload.included,
        itemCount: action.payload.itemCount
      };
    case RESET_ENABLINGS:
      return {
        ...state,
        pagination: initialState.pagination,
        search: initialState.search
      };
    case SET_ENABLINGS_SEARCH:
      return {
        ...state,
        search: action.payload
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
    case SET_ENABLINGS_DETAIL:
      return {
        ...state,
        detailId: action.payload
      };
    default:
      return state;
  }
}

/* Action creators */
function setEnablings(data) {
  return {
    type: SET_ENABLINGS,
    payload: {
      list: data.list.map((l) => {
        return {
          ...l,
          ...{ bmes: getIdRelations(l.relationships.bmes.data, data.included, 'bmes') },
          ...{ category: l.relationships.category.data ? l.relationships.category.data.id : null }
        };
      }),
      included: data.included,
      itemCount: data.itemCount
    }
  };
}

function resetEnablings() {
  return {
    type: RESET_ENABLINGS
  };
}

function setEnablingsLoading(loading) {
  return {
    type: SET_ENABLINGS_LOADING,
    payload: loading
  };
}

function setEnablingDetail(id) {
  return {
    type: SET_ENABLINGS_DETAIL,
    payload: id
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

function setEnablingsSearch(term) {
  return {
    type: SET_ENABLINGS_SEARCH,
    payload: term
  };
}

/* Redux-thunk async actions */
function getEnablings(paramsConfig = {}) {
  let { pageSize, pageNumber, sort } = paramsConfig;
  const { id, search, onSuccess } = paramsConfig;

  pageSize = pageSize || DEFAULT_PAGINATION_SIZE;
  pageNumber = pageNumber || DEFAULT_PAGINATION_NUMBER;
  sort = sort || DEFAULT_SORT_FIELD;

  const queryS = queryString.stringify({
    'page[size]': pageSize,
    'page[number]': pageNumber,
    sort,
    search
  });

  const url = id ?
    `${config.API_URL}/enablings/${id}` :
    `${config.API_URL}/enablings?${queryS}`;

  return (dispatch) => {
    dispatch(setEnablingsLoading(true));
    get({
      url,
      onSuccess({ data, included, meta }) {
        // Parse data to json api format
        if (!Array.isArray(data)) {
          data = [data];
        }

        const parsedData = deserialize(data);
        const parsedIncluded = included.map(incl => deserialize([incl])[0]);

        dispatch(setEnablingsLoading(false));
        dispatch(setEnablings({
          list: parsedData,
          included: parsedIncluded,
          itemCount: meta.total_items
        }));
        onSuccess && onSuccess();
      },
      onError(data) {
        const { status, title } = data.errors[0];
        console.error(status, title);

        if (status === '404') {
          toastr.error('Ops! Enabling Condition Not Found!');

          // redirects to list
          dispatch(push('/enabling-condition'));
        }
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
      body: { enabling: data },
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

function updateEnabling({ id, data, onSuccess }) {
  return (dispatch) => {
    dispatch(setEnablingsLoading(true));
    patch({
      url: `${config.API_URL}/enablings/${id}`,
      body: {
        enabling: data
      },
      onSuccess() {
        dispatch(setEnablingsLoading(false));
        onSuccess && onSuccess(id);
      }
    });
  };
}

export { enablingsReducer, getEnablings, deleteEnabling, createEnabling, updateEnabling, setFilters, setEnablingDetail, resetEnablings, setEnablingsSearch };
