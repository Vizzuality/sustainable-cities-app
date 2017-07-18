import { get, post, patch, _delete } from 'utils/request';
import { deserializeJsona } from 'utils/json-api';
import * as queryString from 'query-string';

import { DEFAULT_PAGINATION_NUMBER, DEFAULT_PAGINATION_SIZE } from 'constants/table';

const SET_EXTERNAL_SOURCES = 'SET_EXTERNAL_SOURCES';
const SET_EXTERNAL_SOURCES_LOADING = 'SET_EXTERNAL_SOURCES_LOADING';

const initialState = {
  loading: false,
  list: [],
};

export function externalSourcesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_EXTERNAL_SOURCES:
      return {
        ...state,
        list: action.payload.data,
      };
    case SET_EXTERNAL_SOURCES_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
}

function setExternalSources(externalSources) {
  return {
    type: SET_EXTERNAL_SOURCES,
    payload: {
      data: externalSources,
    }
  };
}

function setExternalSourcesLoading(loading) {
  return {
    type: SET_EXTERNAL_SOURCES_LOADING,
    payload: loading
  };
}

export function getExternalSources({ pageSize, pageNumber}) {
  const args = {
    'page[size]': pageSize || DEFAULT_PAGINATION_SIZE,
    'page[number]': pageNumber || DEFAULT_PAGINATION_NUMBER,
  };
  const queryS = `?${queryString.stringify(args)}`;

  return (dispatch) => {
    dispatch(setExternalSourcesLoading(true));
    get({
      url: `${config.API_URL}/external-sources/${queryS}`,
      onSuccess(resp) {
        dispatch(setExternalSources(deserializeJsona(resp)));
        dispatch(setExternalSourcesLoading(false));
      }
    });
  };
}
