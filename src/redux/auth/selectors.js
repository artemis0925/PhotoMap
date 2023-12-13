export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;

export const selectUser = (state) => state.auth.user;

export const selectUserId = (state) => state.auth.user.userId;

export const selectUserNickname = (state) => state.auth.user.nickname;

export const selectUserAvatar = (state) => state.auth.user.photoURL;
