import { Reducer } from 'redux';
import { ActionType } from 'typesafe-actions';

import * as actions from '../actions';
import { CHANGE_QUERY_STRING, TOGGLE_USING_SUBST } from '../actions/actionTypes';
import { defaultPlayground, IPlaygroundState } from './states';

export const reducer: Reducer<IPlaygroundState> = (
  state = defaultPlayground,
  action: ActionType<typeof actions>
) => {
  switch (action.type) {
    case CHANGE_QUERY_STRING:
      return {
        ...state,
        queryString: action.payload
      };
    case TOGGLE_USING_SUBST:
      return {
        ...state,
        usingSubst: action.payload
      };
    default:
      return state;
  }
};
