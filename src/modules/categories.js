import { get } from 'utils/request';
import { deserialize } from 'utils/json-api';

const SET_CATEGORIES = 'SET_CATEGORIES';
const SET_CATEGORIES_LOADING = 'SET_CATEGORIES_LOADING';

/* Initial state */
const initialState = {
  loading: false,
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
        [action.payload.type]: action.payload.data
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
function setCategories(categories, type) {
  return {
    type: SET_CATEGORIES,
    payload: {
      data: categories,
      type
    }
  };
}

function setCategoriesLoading(loading) {
  return {
    type: SET_CATEGORIES_LOADING,
    payload: loading
  };
}

/* Redux-thunk async actions */
function getCategories({ type, tree }) {
  const endPoints = {
    bme: 'business-model-element-categories?',
    enablings: 'enabling-categories?',
    impact: 'impact-categories?',
    solution: 'solution-categories?',
    timing: 'timing-categories?'
  };

  const endPoint = tree ? `categories-tree?type=${type}` : endPoints[type];

  return (dispatch) => {
    dispatch(setCategoriesLoading(true));
    get({
      url: `${config.API_URL}/${endPoint}&page[number]=1&page[size]=999999`,
      onSuccess({ data }) {
        dispatch(setCategoriesLoading(false));
        dispatch(setCategories(deserialize(data), type));
      }
    });
  };
}

export { categoriesReducer, getCategories };
