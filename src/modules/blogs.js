import { get, post, patch, _delete } from 'utils/request';
import { deserialize } from 'utils/json-api';
import * as queryString from 'query-string';

// constants
import { DEFAULT_PAGINATION_NUMBER, DEFAULT_PAGINATION_SIZE } from 'constants/table';

/* Action types */
const SET_BLOGS = 'SET_BLOGS';
const SET_BLOGS_LOADING = 'SET_BLOGS_LOADING';
const SET_BLOGS_DETAIL = 'SET_BLOGS_DETAIL';
const SET_BLOGS_FILTERS = 'SET_BLOGS_FILTERS';
const SET_BLOGS_SEARCH = 'SET_BLOGS_SEARCH';
const RESET_BLOGS = 'RESET_BLOGS';


/* Initial state */
const initialState = {
  list: [],
  loading: false,
  detailId: null,
  filters: {},
  itemCount: null,
  pagination: {
    pageSize: DEFAULT_PAGINATION_SIZE,
    pageNumber: DEFAULT_PAGINATION_NUMBER
  },
  search: null
};

// helper
const getBlogPhoto = (include = []) => {
  const photos = include.filter(inc => inc.type === 'photos') || [];
  const photoAttributes = deserialize(photos)[0] || {};
  return { photos_attributes: [photoAttributes] };
};

/* Reducer */
function blogReducer(state = initialState, action) {
  switch (action.type) {
    case SET_BLOGS: {
      const { list, itemCount } = action.payload;
      return {
        ...state,
        list,
        itemCount
      };
    }
    case SET_BLOGS_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case SET_BLOGS_DETAIL:
      return {
        ...state,
        detailId: action.payload
      };
    case SET_BLOGS_FILTERS:
      return {
        ...state,
        ...action.payload
      };
    case SET_BLOGS_SEARCH:
      return {
        ...state,
        search: action.payload
      };
    case RESET_BLOGS:
      return {
        ...state,
        list: [],
        pagination: initialState.pagination,
        search: initialState.search
      };
    default:
      return state;
  }
}

/* Action creators */
function setBlogsLoading(loading) {
  return {
    type: SET_BLOGS_LOADING,
    payload: loading
  };
}

function setBlogs({ list, itemCount }) {
  return {
    type: SET_BLOGS,
    payload: { list, itemCount }
  };
}

function setBlogsDetail(id) {
  return {
    type: SET_BLOGS_DETAIL,
    payload: id
  };
}

/* Thunk actions */
const setFilters = (field, value) => {
  const filter = {};
  filter[field] = value;

  return {
    type: SET_BLOGS_FILTERS,
    payload: filter
  };
};

const setBlogsSearch = (term) => {
  return {
    type: SET_BLOGS_SEARCH,
    payload: term
  };
};

function resetBlogs() {
  return {
    type: RESET_BLOGS
  };
}

const getBlogs = ({ pageNumber, pageSize, search, sort, id }) => (dispatch) => {
  const queryS = queryString.stringify({
    'page[size]': pageSize || 999999,
    'page[number]': pageNumber || 1,
    sort: sort || 'name',
    search
  });

  const params = id ? `/${id}` : `?${queryS}`;

  dispatch(setBlogsLoading(true));
  get({
    url: `${config.API_URL}/blogs/${params}`,
    onSuccess({ data, meta, included }) {
      dispatch(setBlogsLoading(false));

      // Parse data to json api format
      // eslint-disable-next-line no-param-reassign
      if (!Array.isArray(data)) data = [data];
      const parsedData = deserialize(data);

      dispatch(setBlogs({
        list: parsedData.map(blog => ({
          ...blog,
          ...blog.relationships.photos.data.length && getBlogPhoto(included)
        })),
        itemCount: meta.total_items
      }));
    }
  });
};

const createBlogs = ({ data, onSuccess, onError }) => {
  return (dispatch) => {
    dispatch(setBlogsLoading(true));
    post({
      url: `${config.API_URL}/blogs`,
      body: { blog: data },
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      },
      onSuccess() {
        dispatch(setBlogsLoading(false));
        if (onSuccess) onSuccess();
      },
      onError({ errors = [] }) {
        dispatch(setBlogsLoading(false));
        if (onError && errors[0]) onError(errors[0]);
      }
    });
  };
};

const updateBlogs = ({ id, data, onSuccess, onError }) => {
  return (dispatch) => {
    dispatch(setBlogsLoading(true));
    patch({
      url: `${config.API_URL}/blogs/${id}`,
      body: { blog: data },
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      },
      onSuccess() {
        dispatch(setBlogsLoading(false));
        if (onSuccess) onSuccess(id);
      },
      onError({ errors = [] }) {
        dispatch(setBlogsLoading(false));
        if (onError && errors[0]) onError(errors[0]);
      }
    });
  };
};


const deleteBlogs = ({ id, onSuccess }) => {
  return (dispatch) => {
    dispatch(setBlogsLoading(true));
    _delete({
      url: `${config.API_URL}/blogs/${id}`,
      onSuccess() {
        dispatch(setBlogsLoading(false));
        if (onSuccess) onSuccess(id);
      }
    });
  };
};


export {
  blogReducer,
  getBlogs,
  setBlogsDetail,
  deleteBlogs,
  setFilters,
  setBlogsSearch,
  resetBlogs,
  createBlogs,
  updateBlogs
};
