import { get, post, _delete, patch } from 'utils/request';
import { push } from 'react-router-redux';
import { toastr } from 'react-redux-toastr';
import {
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_PAGINATION_NUMBER,
  DEFAULT_SORT_FIELD
} from 'constants/bmes';
import { deserialize } from 'utils/json-api';
import { getIdRelations } from 'utils/relation';
import * as queryString from 'query-string';

/* Constants */
const SET_BMES = 'SET_BMES';
const SET_BMES_LOADING = 'SET_BMES_LOADING';
const SET_BMES_FILTERS = 'SET_BMES_FILTERS';
const SET_BMES_DETAIL = 'SET_BMES_DETAIL';
const SET_BMES_SEARCH = 'SET_BMES_SEARCH';
const RESET_BMES = 'RESET_BMES';

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
function bmesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_BMES:
      return {
        ...state,
        list: action.payload.list,
        included: action.payload.included,
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
    case RESET_BMES:
      return {
        ...state,
        pagination: initialState.pagination,
        search: initialState.search
      };
    case SET_BMES_SEARCH: {
      return {
        ...state,
        search: action.payload
      };
    }
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
      list: data.list.map((l) => {
        return {
          ...l,
          ...{ categories: getIdRelations(l.relationships.categories.data, data.included, 'categories') },
          ...{ enablings: getIdRelations(l.relationships.enablings.data, data.included, 'enablings') }
        };
      }),
      included: data.included,
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

function setBmesSearch(term) {
  return {
    type: SET_BMES_SEARCH,
    payload: term
  };
}

function getBmes(paramsConfig = {}) {
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
      `${config.API_URL}/business-model-elements/${id}` :
      `${config.API_URL}/business-model-elements?${queryS}`;

    dispatch(setBmesLoading(true));

    get({
      url,
      onSuccess({ data, meta, included }) {
        // Parse data to json api format
        if (!Array.isArray(data)) {
          data = [data];
        }

        const bmeData = {
          list: deserialize(data),
          itemCount: meta.total_items
        };

        if (included) {
          bmeData.included = included.map(incl => deserialize([incl])[0]);
        }

        dispatch(setBmesLoading(false));
        dispatch(setBmes(bmeData));
        onSuccess && onSuccess();
      },
      onError(data) {
        const { status, title } = data.errors[0];
        console.error(status, title);

        if (status === '404') {
          toastr.error('Ops! Business Model Element Not Found!');

          // redirects to list
          dispatch(push('/business-model-element'));
        }
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

function resetBmes() {
  return {
    type: RESET_BMES
  };
}

export { bmesReducer, getBmes, createBme, deleteBme, setBmesDetail, updateBme, setFilters, setBmesSearch, resetBmes };
