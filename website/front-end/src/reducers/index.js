import { combineReducers } from 'redux';

import auth from './auth.reducer';
import posts from './posts.reducer';
import profiles from './profiles.reducer';
import feed from './feed.reducer';

import ui from './ui';
import release from './release.reducer';
import app from './app.reducer';
import testcase from './testcase.reducer';

export default combineReducers({
  auth,
  posts,
  profiles,
  feed,
  ui,
  release,
  app,
  testcase
});
