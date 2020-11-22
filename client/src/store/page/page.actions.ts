import * as actionTypes from './page.action-types';
import { PageActionTypes } from './page.types';

export const pageLoadingStart = (): PageActionTypes => {
  return {
    type: actionTypes.PAGE_LOADING_START
  };
};

export const pageLoadingEnd = (): PageActionTypes => {
  return {
    type: actionTypes.PAGE_LOADING_END
  };
};
