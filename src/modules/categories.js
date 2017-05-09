import { get, _delete } from 'utils/request';
import { deserialize } from 'utils/json-api';
import * as queryString from 'query-string';

import { DEFAULT_PAGINATION_NUMBER, DEFAULT_PAGINATION_SIZE } from 'constants/table';

const SET_CATEGORIES = 'SET_CATEGORIES';
const SET_CATEGORIES_FILTER = 'SET_CATEGORIES_FILTER';
const SET_CATEGORIES_SEARCH = 'SET_CATEGORIES_SEARCH';
const SET_CATEGORIES_LOADING = 'SET_CATEGORIES_LOADING';

/* Initial state */
const initialState = {
  loading: false,
  filters: {},
  pagination: {
    pageSize: DEFAULT_PAGINATION_SIZE,
    pageNumber: DEFAULT_PAGINATION_NUMBER
  },
  search: '',
  /* category types */
  all: [],
  Bme: [],
  enablings: [],
  Impact: [],
  Solution: [],
  timing: []
};

/* Reducer */
function categoriesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CATEGORIES:
      return {
        ...state,
        [action.payload.type]: action.payload.data,
        itemCount: action.payload.itemCount
      };
    case SET_CATEGORIES_FILTER: {
      return {
        ...state,
        ...action.payload
      };
    }
    case SET_CATEGORIES_SEARCH: {
      return {
        ...state,
        search: action.payload
      };
    }
    case SET_CATEGORIES_LOADING: {
      return {
        ...state,
        loading: action.payload
      };
    }
    default:
      return state;
  }
}

/* Action creators */
function setCategories(categories, type) {
  return {
    type: SET_CATEGORIES,
    payload: {
      data: categories.list,
      itemCount: categories.itemCount,
      type
    }
  };
}

function setFilters(field, value) {
  const filter = {};
  filter[field] = value;

  return {
    type: SET_CATEGORIES_FILTER,
    payload: filter
  };
}

function setCategoriesSearch(term) {
  return {
    type: SET_CATEGORIES_SEARCH,
    payload: term
  };
}

function setCategoriesLoading(loading) {
  return {
    type: SET_CATEGORIES_LOADING,
    payload: loading
  };
}

/* Redux-thunk async actions */
function getCategories({ type, tree, pageSize, pageNumber, sort, search }) {
  const endPoints = {
    all: 'categories?',
    bme: 'business-model-element-categories?',
    enablings: 'enabling-categories?',
    impact: 'impact-categories?',
    solution: 'solution-categories?',
    timing: 'timing-categories?'
  };

  const endPoint = tree ? `categories-tree?type=${type}` : endPoints[type];
  const queryS = queryString.stringify({
    'page[size]': pageSize || DEFAULT_PAGINATION_SIZE,
    'page[number]': pageNumber || DEFAULT_PAGINATION_NUMBER,
    sort,
    search
  });

  return (dispatch) => {
    dispatch(setCategoriesLoading(true));
    get({
      url: `${config.API_URL}/${endPoint}&${queryS}`,
      onSuccess({ data, meta }) {
        const categoryData = {
          list: deserialize(data),
          itemCount: meta.total_items
        };

        dispatch(setCategoriesLoading(false));
        dispatch(setCategories(categoryData, type));
      }
    });
  };
}

function deleteCategory({ id, onSuccess }) {
  return (dispatch) => {
    dispatch(setCategoriesLoading(true));
    _delete({
      url: `${config.API_URL}/categories/${id}`,
      onSuccess() {
        dispatch(setCategoriesLoading(false));
        onSuccess && onSuccess(id);
      }
    });
  };
}

export { categoriesReducer, deleteCategory, getCategories, setCategoriesSearch, setFilters };
