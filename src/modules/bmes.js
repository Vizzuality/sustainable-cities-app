import { get, post, _delete, patch } from 'utils/request';
import { push } from 'react-router-redux';
import {
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_PAGINATION_NUMBER,
  DEFAULT_SORT_FIELD
} from 'constants/bmes';
import { deserialize } from 'utils/json-api';
import { getIdRelations } from 'utils/relation';

/* Constants */
const SET_BMES = 'SET_BMES';
const SET_BMES_LOADING = 'SET_BMES_LOADING';
const SET_BMES_FILTERS = 'SET_BMES_FILTERS';
const SET_BMES_DETAIL = 'SET_BMES_DETAIL';

/* Initial state */
const initialState = {
  loading: false,
  list: [],
  included: [],
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
          ...{ categories: getIdRelations(l.relationships.categories.data, data.included) },
          ...{ enablings: getIdRelations(l.relationships.enablings.data, data.included) }
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

        // redirects to list
        dispatch(push('/business-model-element'));
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
