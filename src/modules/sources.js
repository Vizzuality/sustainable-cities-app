import { get, post, _delete, patch } from 'utils/request';
import { push } from 'react-router-redux';
import { toastr } from 'react-redux-toastr';
import { DEFAULT_SORT_FIELD } from 'constants/sources';
import { DEFAULT_PAGINATION_NUMBER, DEFAULT_PAGINATION_SIZE } from 'constants/table';
import { deserialize } from 'utils/json-api';
import * as queryString from 'query-string';

/* Constants */
const SET_SOURCES = 'SET_SOURCES';
const SET_SOURCE_LOADING = 'SET_SOURCE_LOADING';
const SET_SOURCES_FILTERS = 'SET_SOURCES_FILTERS';
const SET_SOURCE_DETAIL = 'SET_SOURCE_DETAIL';
const SET_SOURCE_SEARCH = 'SET_SOURCE_SEARCH';
const RESET_SOURCES = 'RESET_SOURCES';

/* Initial state */
const initialState = {
  loading: false,
  list: [],
  included: [],
  itemCount: null,
  detailId: null,
  filters: {},
  search: '',
  pagination: {
    pageSize: DEFAULT_PAGINATION_SIZE,
    pageNumber: DEFAULT_PAGINATION_NUMBER
  }
};

/* Reducer */
function sourcesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SOURCES:
      return {
        ...state,
        list: action.payload.list,
        included: action.payload.included,
        itemCount: action.payload.itemCount
      };
    case SET_SOURCE_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case SET_SOURCES_FILTERS:
      return {
        ...state,
        ...action.payload
      };
    case RESET_SOURCES:
      return {
        ...state,
        pagination: initialState.pagination,
        search: initialState.search
      };
    case SET_SOURCE_SEARCH: {
      return {
        ...state,
        search: action.payload
      };
    }
    case SET_SOURCE_DETAIL:
      return {
        ...state,
        detailId: action.payload
      };
    default:
      return state;
  }
}

/* Action creators */
function setSources(data) {
  return {
    type: SET_SOURCES,
    payload: {
      list: data.list,
      included: data.included,
      itemCount: data.itemCount
    }
  };
}

function setSourceLoading(loading) {
  return {
    type: SET_SOURCE_LOADING,
    payload: loading
  };
}

function setFilters(field, value) {
  const filter = {};
  filter[field] = value;

  return {
    type: SET_SOURCES_FILTERS,
    payload: filter
  };
}

function setSourceDetail(id) {
  return {
    type: SET_SOURCE_DETAIL,
    payload: id
  };
}

function setSourcesSearch(term) {
  return {
    type: SET_SOURCE_SEARCH,
    payload: term
  };
}

function getSources(paramsConfig = {}) {
  return (dispatch) => {
    let { pageSize, pageNumber, sort } = paramsConfig;
    const { onSuccess, id, search } = paramsConfig;

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
      `${config.API_URL}/sources/${id}` :
      `${config.API_URL}/sources?${queryS}`;

    dispatch(setSourceLoading(true));

    get({
      url,
      onSuccess({ data, meta, included }) {
        // Parse data to json api format
        if (!Array.isArray(data)) {
          data = [data];
        }

        const sourceData = {
          list: deserialize(data),
          itemCount: meta.total_items
        };

        if (included) {
          sourceData.included = included.map(incl => deserialize([incl])[0]);
        }

        dispatch(setSourceLoading(false));
        dispatch(setSources(sourceData));
        onSuccess && onSuccess();
      },
      onError(data) {
        const { status, title } = data.errors[0];
        console.error(status, title);

        if (status === '404') {
          toastr.error('Ops! Source Not Found!');

          // redirects to list
          dispatch(push('/source'));
        }
      }
    });
  };
}

function createSource({ data, onSuccess }) {
  return (dispatch) => {
    dispatch(setSourceLoading(true));
    post({
      url: `${config.API_URL}/sources`,
      body: {
        source: data
      },
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      },
      onSuccess() {
        dispatch(setSourceLoading(false));
        onSuccess && onSuccess();
      }
    });
  };
}

function updateSource({ id, data, onSuccess }) {
  return (dispatch) => {
    dispatch(setSourceLoading(true));
    patch({
      url: `${config.API_URL}/sources/${id}`,
      body: {
        source: data
      },
      onSuccess() {
        dispatch(setSourceLoading(false));
        onSuccess && onSuccess(id);
      }
    });
  };
}

function deleteSource({ id, onSuccess }) {
  return (dispatch) => {
    dispatch(setSourceLoading(true));
    _delete({
      url: `${config.API_URL}/sources/${id}`,
      onSuccess() {
        dispatch(setSourceLoading(false));
        onSuccess && onSuccess(id);
      }
    });
  };
}

function resetSources() {
  return {
    type: RESET_SOURCES
  };
}

export { sourcesReducer, getSources, createSource, deleteSource, setSourceDetail, updateSource, setFilters, setSourcesSearch, resetSources };
