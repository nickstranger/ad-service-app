import { PageState, PageActionTypes } from './page.types';
import * as actionTypes from './page.action-types';

const initialState: PageState = {
  loading: false
};

const pageLoadingStart = (state: PageState): PageState => {
  return {
    ...state,
    loading: true
  };
};

const pageLoadingEnd = (state: PageState): PageState => {
  return {
    ...state,
    loading: false
  };
};

export const pageReducer = (state = initialState, action: PageActionTypes): PageState => {
  switch (action.type) {
    case actionTypes.PAGE_LOADING_START:
      return pageLoadingStart(state);
    case actionTypes.PAGE_LOADING_END:
      return pageLoadingEnd(state);
    default:
      return state;
  }
};
