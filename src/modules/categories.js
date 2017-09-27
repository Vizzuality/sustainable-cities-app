import { get, post, patch, _delete } from 'utils/request';
import { deserialize } from 'utils/json-api';
import * as queryString from 'query-string';

import { DEFAULT_PAGINATION_NUMBER, DEFAULT_PAGINATION_SIZE } from 'constants/table';

const SET_CATEGORIES = 'SET_CATEGORIES';
const SET_CATEGORIES_FILTER = 'SET_CATEGORIES_FILTER';
const SET_CATEGORIES_DETAIL = 'SET_CATEGORIES_DETAIL';
const SET_CATEGORIES_SEARCH = 'SET_CATEGORIES_SEARCH';
const SET_CATEGORIES_LOADING = 'SET_CATEGORIES_LOADING';

/* Initial state */
const initialState = {
  loading: false,
  filters: {},
  detailId: null,
  pagination: {
    pageSize: DEFAULT_PAGINATION_SIZE,
    pageNumber: DEFAULT_PAGINATION_NUMBER
  },
  search: '',
  /* category types */
  bme: [],
  all: [],
  enablings: [],
  impact: [],
  solution: [],
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
    case SET_CATEGORIES_DETAIL: {
      return {
        ...state,
        detailId: action.payload
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

function setCategoryDetail(id) {
  return {
    type: SET_CATEGORIES_DETAIL,
    payload: id
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
function createCategory({ data, onSuccess }) {
  return (dispatch) => {
    dispatch(setCategoriesLoading(true));
    post({
      url: `${config.API_URL}/categories`,
      body: {
        category: data
      },
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      },
      onSuccess() {
        dispatch(setCategoriesLoading(false));
        if (onSuccess) onSuccess();
      }
    });
  };
}

function getCategories({ type, id, tree, pageSize, pageNumber, sort, search }) {
  const endPoints = {
    detail: 'categories/',
    all: 'categories?',
    bme: 'business-model-element-categories?',
    enablings: 'enabling-categories?',
    impact: 'impact-categories?',
    solution: 'solution-categories?',
    timing: 'timing-categories?'
  };

  const endPoint = tree ? `categories-tree?type=${type}` : endPoints[type];
  const queryS = id || `&${queryString.stringify({
    'page[size]': pageSize || DEFAULT_PAGINATION_SIZE,
    'page[number]': pageNumber || DEFAULT_PAGINATION_NUMBER,
    sort,
    search
  })}`;

  return (dispatch) => {
    dispatch(setCategoriesLoading(true));
    get({
      url: `${config.API_URL}/${endPoint}${queryS}`,
      onSuccess({ data, meta }) {
        let parsedData = data;

        // Parse data to json api format
        if (!Array.isArray(parsedData)) {
          parsedData = [data];
        }

        const categoryData = {
          list: deserialize(parsedData),
          itemCount: meta.total_items
        };

        dispatch(setCategoriesLoading(false));
        dispatch(setCategories(categoryData, type.toLowerCase()));
      }
    });
  };
}

function updateCategory({ id, data, onSuccess }) {
  return (dispatch) => {
    dispatch(setCategoriesLoading(true));
    patch({
      url: `${config.API_URL}/categories/${id}`,
      body: {
        category: data
      },
      onSuccess() {
        dispatch(setCategoriesLoading(false));
        if (onSuccess) onSuccess(id);
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
        if (onSuccess) onSuccess(id);
      }
    });
  };
}

export {
  categoriesReducer,
  createCategory,
  deleteCategory,
  getCategories,
  setCategoryDetail,
  setCategoriesSearch,
  setFilters,
  updateCategory
};
