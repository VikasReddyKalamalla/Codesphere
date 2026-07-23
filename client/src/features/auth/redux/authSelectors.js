export const selectAuth = (state) => state.auth;
export const selectCurrentUser = (state) => state.auth?.user;
export const selectIsAuthenticated = (state) => state.auth?.isAuthenticated;
