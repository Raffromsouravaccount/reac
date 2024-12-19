import {
  INCREASE_REQUEST,
  DECREASE_REQUEST
} from '../_constants/common.constants';

const INITIAL_STATE= {
  requestCount: 0
};

export function common_reducer(state= INITIAL_STATE, action) {
  switch(action.type) {
    case INCREASE_REQUEST: {
      return {
        ...state,
        requestCount: state.requestCount+1
      };
    }

    case DECREASE_REQUEST: {
      return {
        ...state,
        requestCount: state.requestCount-1
      };
    }

    default: {
      return state;
    }     
  }
}