import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";

import { authReducer } from "./auth/authSlice";
import { postsReducer } from "./posts/postSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  posts: postsReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;
