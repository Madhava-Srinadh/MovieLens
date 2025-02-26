import { createSlice } from "@reduxjs/toolkit";

const ListSlice = createSlice({
  name: "myList",
  initialState: {
    movies: [],
  },
  reducers: {
    addToMyList: (state, action) => {
      if (!state.movies.some((movie) => movie.id === action.payload.id)) {
        state.movies.push(action.payload);
      }
    },
    removeFromMyList: (state, action) => {
      state.movies = state.movies.filter(
        (movie) => movie.id !== action.payload
      );
    },
  },
});

export const { addToMyList, removeFromMyList } = ListSlice.actions;
export default ListSlice.reducer;
