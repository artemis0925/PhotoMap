import { createSlice } from "@reduxjs/toolkit";
import {
  getDataFromFirestore,
  writeDataToFirestore,
  writeCommentToFirestore,
  getCommentsFromFirestore,
  getCurrentUserPosts,
  getCurrentAvatarOfUser,
  updateCommentsAvatar,
  toggleLikeInFirebase,
} from "./operations";

const initialState = {
  postsList: [],
  comments: [],
  userPostsList: [],
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  extraReducers: {
    writeDataToFirestore,
    writeCommentToFirestore,
    [getDataFromFirestore.fulfilled](state, action) {
      state.postsList = action.payload;
    },
    [getCommentsFromFirestore.fulfilled](state, action) {
      state.comments = action.payload;
    },
    [getCurrentUserPosts.fulfilled](state, action) {
      state.userPostsList = action.payload;
    },
    getCurrentAvatarOfUser,
    updateCommentsAvatar,
    toggleLikeInFirebase,
  },
});

export const postsReducer = postsSlice.reducer;
