import { isLogged } from 'utils/auth';
import { post } from 'utils/request';

/* Constants */
const SET_LOGGED = 'SET_LOGGED';
const SET_USER = 'SET_USER';
const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';

/* Initial state */
const initialState = {
  logged: isLogged(),
  user: null,
  loading: false,
  error: null
};

/* Reducer */
function loginReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOGGED:
      return {
        ...state,
        logged: action.payload
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload
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

function setUser(user) {
  return {
    type: SET_USER,
    payload: user
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

function login({ email, password, onSuccess, onError }) {
  return (dispatch) => {
    dispatch(setError(null));
    dispatch(setLoading(true));
    post({
      url: `${config.API_URL}/login`,
      body: {
        auth: { email, password }
      },
      onSuccess({ token }) {
        localStorage.token = token;
        dispatch(setUser(email));
        dispatch(setLogged(true));
        dispatch(setLoading(false));
        typeof onSuccess === 'function' && onSuccess();
      },
      onError(error) {
        dispatch(setLoading(false));
        dispatch(setError(error));
        typeof onError === 'function' && onError(error);
      }
    });
  };
}

function logout() {
  return (dispatch) => {
    delete localStorage.token;
    dispatch(setLogged(false));
  };
}

export { loginReducer, login, logout };
