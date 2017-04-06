import { replace } from 'react-router-redux';

const authRedirectMiddleware = store => next => (action) => {
  const loginPath = '/login';
  const { logged } = store.getState().user;

  if (action.type === '@@router/LOCATION_CHANGE' && !logged && action.payload.pathname !== loginPath) {
    if (window.location.pathname !== loginPath) {
      store.dispatch(replace(loginPath));
    }
  } else {
    next(action);
  }
};

export default authRedirectMiddleware;
