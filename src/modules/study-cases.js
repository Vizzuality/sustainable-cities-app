import { get, post, _delete, patch } from 'utils/request';
import { DEFAULT_SORT_FIELD } from 'constants/bmes';
import { DEFAULT_PAGINATION_NUMBER, DEFAULT_PAGINATION_SIZE } from 'constants/table';
import { deserialize } from 'utils/json-api';
import * as queryString from 'query-string';

/* Constants */
const SET_STUDY_CASES = 'SET_STUDY_CASES';
const SET_STUDY_CASES_LOADING = 'SET_STUDY_CASES_LOADING';
const SET_STUDY_CASES_FILTERS = 'SET_STUDY_CASES_FILTERS';
const SET_STUDY_CASES_DETAIL = 'SET_STUDY_CASES_DETAIL';
const CONCAT_STUDY_CASES = 'CONCAT_STUDY_CASES';

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
function studyCasesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_STUDY_CASES: {
      const { list, included, itemCount } = action.payload;
      return { ...state, list, included, itemCount };
    }
    case CONCAT_STUDY_CASES:
      return {
        ...state,
        list: [...state.list, ...action.payload.list],
        itemCount: action.payload.itemCount
      };
    case SET_STUDY_CASES_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case SET_STUDY_CASES_FILTERS:
      return {
        ...state,
        ...action.payload
      };
    case SET_STUDY_CASES_DETAIL:
      return {
        ...state,
        detailId: action.payload
      };
    default:
      return state;
  }
}

/* Action creators */
function setStudyCases(data) {
  return {
    type: SET_STUDY_CASES,
    payload: data
  };
}

function concatStudyCases(data) {
  return {
    type: CONCAT_STUDY_CASES,
    payload: data
  };
}

function setStudyCasesLoading(loading) {
  return {
    type: SET_STUDY_CASES_LOADING,
    payload: loading
  };
}

function setFilters(field, value) {
  const filter = {};
  filter[field] = value;

  return {
    type: SET_STUDY_CASES_FILTERS,
    payload: filter
  };
}

function setStudyCaseDetail(id) {
  return {
    type: SET_STUDY_CASES_DETAIL,
    payload: id
  };
}

function getStudyCases(paramsConfig = {}) {
  return (dispatch) => {
    let { pageSize, pageNumber, sort } = paramsConfig;
    const { search, onSuccess, id, concat } = paramsConfig;

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
      `${config.API_URL}/study-cases/${id}` :
      `${config.API_URL}/study-cases?${queryS}`;

    dispatch(setStudyCasesLoading(true));

    get({
      url,
      onSuccess({ data, meta, included }) {
        let parsedData = data;

        // Parse data to json api format
        if (!Array.isArray(parsedData)) {
          parsedData = [data];
        }

        const studyCasesData = {
          list: deserialize(parsedData),
          itemCount: meta.total_items
        };

        if (included) {
          studyCasesData.included = deserialize(included);
        }

        const action = concat ? concatStudyCases : setStudyCases;

        dispatch(setStudyCasesLoading(false));
        dispatch(action(studyCasesData));
        if (onSuccess) onSuccess();
      }
    });
  };
}

function createProject({ data, onSuccess, type }) {
  return (dispatch) => {
    dispatch(setStudyCasesLoading(true));
    post({
      url: `${config.API_URL}/projects`,
      body: {
        project: {
          ...data,
          is_active: true,
          project_type: type
        }
      },
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      },
      onSuccess() {
        dispatch(setStudyCasesLoading(false));
        if (onSuccess) onSuccess();
      }
    });
  };
}

function createStudyCase({ data, onSuccess }) {
  return (dispatch) => {
    dispatch(createProject({
      data,
      onSuccess,
      type: 'StudyCase'
    }));
  };
}

function updateStudyCase({ id, data, onSuccess }) {
  return (dispatch) => {
    dispatch(setStudyCasesLoading(true));
    patch({
      url: `${config.API_URL}/projects/${id}`,
      body: {
        project: data
      },
      onSuccess() {
        dispatch(setStudyCasesLoading(false));
        if (onSuccess) onSuccess(id);
      }
    });
  };
}

function deleteStudyCase({ id, onSuccess }) {
  return (dispatch) => {
    dispatch(setStudyCasesLoading(true));
    _delete({
      url: `${config.API_URL}/projects/${id}`,
      onSuccess() {
        dispatch(setStudyCasesLoading(false));
        if (onSuccess) onSuccess(id);
      }
    });
  };
}

export {
  studyCasesReducer,
  getStudyCases,
  createStudyCase,
  deleteStudyCase,
  setStudyCaseDetail,
  updateStudyCase,
  setFilters
};
