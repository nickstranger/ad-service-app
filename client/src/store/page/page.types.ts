import * as actionTypes from './page.action-types';

export interface PageState {
  loading: boolean;
}

interface PageLoadingStartAction {
  type: typeof actionTypes.PAGE_LOADING_START;
}

interface PageLoadingEndAction {
  type: typeof actionTypes.PAGE_LOADING_END;
}

export type PageActionTypes = PageLoadingStartAction | PageLoadingEndAction;
