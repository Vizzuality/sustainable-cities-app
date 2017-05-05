import { get, post, _delete, patch } from 'utils/request';
import { push } from 'react-router-redux';
import { toastr } from 'react-redux-toastr';
import {
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_PAGINATION_NUMBER,
  DEFAULT_SORT_FIELD
} from 'constants/impacts';
import { deserialize } from 'utils/json-api';
import { getIdRelations } from 'utils/relation';

/* Constants */
const SET_IMPACT = 'SET_IMPACT';
const SET_IMPACT_LOADING = 'SET_IMPACT_LOADING';
const SET_IMPACT_FILTERS = 'SET_IMPACT_FILTERS';
const SET_IMPACT_DETAIL = 'SET_IMPACT_DETAIL';
const SET_IMPACT_SEARCH = 'SET_IMPACT_SEARCH';
const RESET_IMPACTS = 'RESET_IMPACTS';

/* Initial state */
const initialState = {
  loading: false,
  list: [],
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
function impactReducer(state = initialState, action) {
  switch (action.type) {
    case SET_IMPACT:
      return {
        ...state,
        list: action.payload.list,
        itemCount: action.payload.itemCount
      };
    case SET_IMPACT_SEARCH:
      return {
        ...state,
        search: action.payload
      };
    case RESET_IMPACTS:
      return {
        ...state,
        pagination: initialState.pagination,
        search: initialState.search
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
      list: data.list.map((l) => {
        return {
          ...l,
          ...{ category: l.relationships.category.data ? l.relationships.category.data.id : null }
        };
      }),
      included: data.included,
      itemCount: data.itemCount
    }
  };
}

function resetImpacts() {
  return {
    type: RESET_IMPACTS
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

function setImpactSearch(term) {
  return {
    type: SET_IMPACT_SEARCH,
    payload: term
  };
}

function getImpacts(paramsConfig = {}) {
  return (dispatch) => {
    let { search, pageSize, pageNumber, sort } = paramsConfig;
    const { onSuccess, id } = paramsConfig;

    pageSize = pageSize || DEFAULT_PAGINATION_SIZE;
    pageNumber = pageNumber || DEFAULT_PAGINATION_NUMBER;
    sort = sort || DEFAULT_SORT_FIELD;
    search = search && search.length ? `&search=${search}` : '';

    const url = id ?
      `${config.API_URL}/impacts/${id}` :
      `${config.API_URL}/impacts?page[size]=${pageSize}&page[number]=${pageNumber}&sort=${sort}${search}`;

    dispatch(setImpactLoading(true));

    get({
      url,
      onSuccess({ data, meta, included }) {
        // Parse data to json api format
        if (!Array.isArray(data)) {
          data = [data];
        }

        const impactData = {
          list: deserialize(data),
          itemCount: meta.total_items
        };

        if (included) {
          impactData.included = included.map(incl => deserialize([incl])[0]);
        }

        dispatch(setImpactLoading(false));
        dispatch(setImpacts(impactData));
        onSuccess && onSuccess();
      },
      onError(data) {
        const { status, title } = data.errors[0];
        console.error(status, title);

        if (status === '404') {
          toastr.error('Ops! Impact Not Found!');

          // redirects to list
          dispatch(push('/impact'));
        }
      }
    });
  };
}

function createImpact({ data, onSuccess }) {
  return (dispatch) => {
    dispatch(setImpactLoading(true));
    post({
      url: `${config.API_URL}/impacts`,
      body: { impact: data },
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
        impact: data
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

export { impactReducer, getImpacts, createImpact, deleteImpact, setImpactDetail, updateImpact, setFilters, resetImpacts, setImpactSearch };
