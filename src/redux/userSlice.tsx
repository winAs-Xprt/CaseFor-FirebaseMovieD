import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface MovieState {
  data: [] | null;
  loading: boolean;
  error: string | null;
}

const initialState: MovieState = {
  data: [],
  loading: false,
  error: null,
};

// Update the API link to the new movie API
export const getMovies = createAsyncThunk('movies/getMovies', async () => {
  return fetch('https://raw.githubusercontent.com/winAs-Xprt/movieData/refs/heads/main/movies.json')
    .then((res) => res.json());
});

export const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(getMovies.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
        state.data = [];
      });
  },
});

export default movieSlice.reducer;
