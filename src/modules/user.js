// NOTE: APi doc -> https://sc-api-documentation.herokuapp.com/index.html#registration

import { isLogged } from 'utils/auth';
import { post, get } from 'utils/request';
import { replace } from 'react-router-redux';

/* Constants */
const SET_LOGGED = 'SET_LOGGED';
const SET_USER_DATA = 'SET_USER_DATA';
const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';

/* Initial state */
const initialState = {
  data: null,
  logged: isLogged(),
  loading: false,
  error: null
};

/* Reducer */
function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOGGED:
      return {
        ...state,
        logged: action.payload
      };
    case SET_USER_DATA:
      return {
        ...state,
        data: action.payload
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
}

/* Action creators */
function setLogged(logged) {
  return {
    type: SET_LOGGED,
    payload: logged
  };
}

function setUserData(data) {
  return {
    type: SET_USER_DATA,
    payload: data
  };
}

function setLoading(loading) {
  return {
    type: SET_LOADING,
    payload: loading
  };
}

function setError(error) {
  return {
    type: SET_ERROR,
    payload: error
  };
}

/* Redux-thunk async actions */
function getUserData() {
  return (dispatch) => {
    get({
      url: `${config.API_URL}/users/current-user`,
      onSuccess({ data }) {
        dispatch(setUserData(data.attributes));
      }
    });
  };
}

function login(userData) {
  return (dispatch) => {
    dispatch(setError(null));
    dispatch(setLoading(true));
    post({
      url: `${config.API_URL}/login`,
      body: {
        auth: userData
      },
      onSuccess({ token }) {
        localStorage.token = token;
        dispatch(setLogged(true));
        dispatch(setLoading(false));
        dispatch(replace('/backoffice'));
        dispatch(getUserData());
      },
      onError(error) {
        dispatch(setLoading(false));
        dispatch(setError(error));
      }
    });
  };
}

function logout() {
  return (dispatch) => {
    delete localStorage.token;
    dispatch(setLogged(false));
    dispatch(setUserData(null));
    dispatch(replace('/backoffice/login'));
  };
}

function register({ email, nickname, password, password_confirmation, name }, loginAfterRegister) {
  return (dispatch) => {
    dispatch(setError(null));
    dispatch(setLoading(true));
    post({
      url: `${config.API_URL}/register`,
      body: {
        user: {
          email,
          nickname,
          password,
          password_confirmation,
          name
        }
      },
      onSuccess() {
        // Login user after register
        dispatch(setLoading(false));
        if (loginAfterRegister) dispatch(login({ email, password }));
      },
      onError(error) {
        dispatch(setLoading(false));
        dispatch(setError(error));
      }
    });
  };
}

export { userReducer, login, logout, getUserData, register };
