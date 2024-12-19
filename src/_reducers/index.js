import { combineReducers } from 'redux';

import {  login_reducer } from "./login.reducer";
import { user_reducer } from './user.reducer';
import { alert } from './alert.reducer';
import {castCrewMgmt_reducer}  from './castCrewMgmt.reducer';
import { common_reducer } from './common.reducer';
import {master_reducer} from './master.reducer';
import {movieMgmt_reducer} from './movieMgmt.reducer';
import  { collection_reducer } from "./collection.reducer";
import  {videoMgmt_reducer} from "./videoMgmt.reducer";
import {tvShows_reducer} from './tvShows.reducer';

const rootReducer = combineReducers({
  login_reducer, user_reducer,
  alert, castCrewMgmt_reducer, common_reducer,
  master_reducer,
  collection_reducer,
  movieMgmt_reducer,
  videoMgmt_reducer,
  tvShows_reducer
});

export default rootReducer;