import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { db } from '../firebaseConfig'; 
import { collection, getDocs } from 'firebase/firestore';

interface Movie {
  id: string;
  title: string;
  year: number;
  director: string;
  poster: string;
}

interface MovieState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
}

const initialState: MovieState = {
  movies: [],
  loading: false,
  error: null,
};

export const fetchMovies = createAsyncThunk('movies/fetchMovies', async () => {
  const movieCollection = collection(db, 'movies');
  const movieSnapshot = await getDocs(movieCollection);
  const movieList: Movie[] = movieSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data() as Omit<Movie, 'id'>, 
  }));

  return movieList;
});

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    addMovie: (state, action: PayloadAction<Movie>) => {
      state.movies.push(action.payload);
    },
    setMovies: (state, action: PayloadAction<Movie[]>) => {
      state.movies = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch movies';
      });
  },
});

export const { addMovie, setMovies } = movieSlice.actions;

export default movieSlice.reducer;
