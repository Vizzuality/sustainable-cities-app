import { get } from 'utils/request';

const SET_CATEGORIES = 'SET_CATEGORIES';
const SET_CATEGORIES_LOADING = 'SET_CATEGORIES_LOADING';

/* Initial state */
const initialState = {
  loading: false,
  list: []
};

/* Reducer */
function categoriesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CATEGORIES:
      return {
        ...state,
        list: action.payload
      };
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
function setCategories(categories) {
  return {
    type: SET_CATEGORIES,
    payload: categories
  };
}

function setCategoriesLoading(loading) {
  return {
    type: SET_CATEGORIES_LOADING,
    payload: loading
  };
}

/* Redux-thunk async actions */
function getCategories() {
  return (dispatch) => {
    dispatch(setCategoriesLoading(true));
    get({
      url: `${config.API_URL}/categories`,
      onSuccess({ data }) {
        dispatch(setCategoriesLoading(false));
        dispatch(setCategories(data));
      }
    });
  };
}

export { categoriesReducer, getCategories };
