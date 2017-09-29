import { get, post, patch, _delete } from 'utils/request';
import { deserialize } from 'utils/json-api';
import * as queryString from 'query-string';

// constants
import { DEFAULT_PAGINATION_NUMBER, DEFAULT_PAGINATION_SIZE } from 'constants/table';

/* Action types */
const SET_EVENTS = 'SET_EVENTS';
const SET_EVENTS_LOADING = 'SET_EVENTS_LOADING';
const SET_EVENTS_DETAIL = 'SET_EVENTS_DETAIL';
const SET_EVENTS_FILTERS = 'SET_EVENTS_FILTERS';
const SET_EVENTS_SEARCH = 'SET_EVENTS_SEARCH';
const RESET_EVENTS = 'RESET_EVENTS';


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

/* Reducer */
function eventsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_EVENTS: {
      const { list, itemCount } = action.payload;
      return {
        ...state,
        list,
        itemCount
      };
    }
    case SET_EVENTS_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case SET_EVENTS_DETAIL:
      return {
        ...state,
        detailId: action.payload
      };
    case SET_EVENTS_FILTERS:
      return {
        ...state,
        ...action.payload
      };
    case SET_EVENTS_SEARCH:
      return {
        ...state,
        search: action.payload
      };
    case RESET_EVENTS:
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
function setEventsLoading(loading) {
  return {
    type: SET_EVENTS_LOADING,
    payload: loading
  };
}

function setEvents({ list, itemCount }) {
  return {
    type: SET_EVENTS,
    payload: { list, itemCount }
  };
}

function setEventsDetail(id) {
  return {
    type: SET_EVENTS_DETAIL,
    payload: id
  };
}

/* Thunk actions */
const setFilters = (field, value) => {
  const filter = {};
  filter[field] = value;

  return {
    type: SET_EVENTS_FILTERS,
    payload: filter
  };
};

const setEventsSearch = (term) => {
  return {
    type: SET_EVENTS_SEARCH,
    payload: term
  };
};

function resetEvents() {
  return {
    type: RESET_EVENTS
  };
}

const getEvents = ({ pageNumber, pageSize, search, sort, id }) => (dispatch) => {
  const queryS = queryString.stringify({
    'page[size]': pageSize || 999999,
    'page[number]': pageNumber || 1,
    sort: sort || 'name',
    search
  });

  const params = id ? `/${id}` : `?${queryS}`;

  dispatch(setEventsLoading(true));
  get({
    url: `${config.API_URL}/events/${params}`,
    onSuccess({ data, meta }) {
      dispatch(setEventsLoading(false));

      // Parse data to json api format
      // eslint-disable-next-line no-param-reassign
      if (!Array.isArray(data)) data = [data];
      const parsedData = deserialize(data);

      dispatch(setEvents({
        list: parsedData,
        itemCount: meta.total_items
      }));
    }
  });
};

const createEvents = ({ data, onSuccess, onError }) => {
  return (dispatch) => {
    dispatch(setEventsLoading(true));
    post({
      url: `${config.API_URL}/events`,
      body: { event: data },
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      },
      onSuccess() {
        dispatch(setEventsLoading(false));
        if (onSuccess) onSuccess();
      },
      onError({ errors = [] }) {
        dispatch(setEventsLoading(false));
        if (onError && errors[0]) onError(errors[0]);
      }
    });
  };
};

const updateEvents = ({ id, data, onSuccess, onError }) => {
  return (dispatch) => {
    dispatch(setEventsLoading(true));
    patch({
      url: `${config.API_URL}/events/${id}`,
      body: { event: data },
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      },
      onSuccess() {
        dispatch(setEventsLoading(false));
        if (onSuccess) onSuccess(id);
      },
      onError({ errors = [] }) {
        dispatch(setEventsLoading(false));
        if (onError && errors[0]) onError(errors[0]);
      }
    });
  };
};


const deleteEvents = ({ id, onSuccess }) => {
  return (dispatch) => {
    dispatch(setEventsLoading(true));
    _delete({
      url: `${config.API_URL}/events/${id}`,
      onSuccess() {
        dispatch(setEventsLoading(false));
        if (onSuccess) onSuccess(id);
      }
    });
  };
};


export {
  eventsReducer,
  getEvents,
  setEventsDetail,
  deleteEvents,
  setFilters,
  setEventsSearch,
  resetEvents,
  createEvents,
  updateEvents
};
