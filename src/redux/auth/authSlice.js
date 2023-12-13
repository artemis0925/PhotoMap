import { createSlice } from "@reduxjs/toolkit";
import {
  registerDB,
  loginDB,
  logOut,
  authStateChanged,
  uploadPhotoToStorage,
  updateAvatar,
  updateNickname,
} from "./operations";

const initialState = {
  user: { userId: null, nickname: null, email: "", photoURL: null },
  isLoggedIn: false,
};

const successfulLogin = (state, action) => {
  state.user.userId = action.payload.uid;
  state.user.nickname = action.payload.displayName;
  state.user.email = action.payload.email;
  state.user.photoURL = action.payload.photoURL;
  state.isLoggedIn = true;
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  extraReducers: {
    [registerDB.fulfilled](state, action) {
      successfulLogin(state, action);
    },
    [loginDB.fulfilled](state, action) {
      successfulLogin(state, action);
    },
    [authStateChanged.fulfilled](state, action) {
      successfulLogin(state, action);
    },
    [logOut.fulfilled](state) {
      state.user = { userId: null, nickname: null, email: "", photoURL: null };
      state.isLoggedIn = false;
    },
    [uploadPhotoToStorage.fulfilled](state, action) {
      state.user.photoURL = action.payload;
    },
    [updateAvatar.fulfilled](state, action) {
      state.user.photoURL = action.payload.photoURL;
    },
    [updateNickname.fulfilled](state, action) {
      state.user.nickname = action.payload;
    },
  },
});

export const authReducer = authSlice.reducer;
