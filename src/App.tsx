// src/App.tsx
import React, { useEffect, useState } from 'react';
import { db } from './firebaseConfig';
import AddMovieForm from './components/AddMovieForm';
import { collection, getDocs } from 'firebase/firestore';
import './App.css';

// Define a type for the movie
interface Movie {
  id?: string; // optional because it will not be present for the static JSON movies
  Title: string;
  Year: string;
  Director: string;
  Plot: string;
  Images: string[];
}

function App() {
  const [staticMovies, setStaticMovies] = useState<Movie[]>([]); // State to hold the static movies
  const [newMovies, setNewMovies] = useState<Movie[]>([]); // State to hold the new movies

  // Fetch static movies from the provided JSON link
  const fetchStaticMovies = async () => {
    const response = await fetch('https://raw.githubusercontent.com/winAs-Xprt/movieData/refs/heads/main/movies.json');
    const data = await response.json();
    setStaticMovies(data); // Set the fetched static movies
  };

  // Fetch movies from Firestore
  const fetchNewMovies = async () => {
    const querySnapshot = await getDocs(collection(db, 'movies'));
    const moviesData = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Ensure to return a Movie type object
      return {
        id: doc.id,
        Title: data.Title,
        Year: data.Year,
        Director: data.Director,
        Plot: data.Plot,
        Images: data.Images,
      } as Movie; // Type assertion to Movie
    });
    setNewMovies(moviesData); 
  };

  useEffect(() => {
    fetchStaticMovies(); 
    fetchNewMovies(); 
  }, []);

  // Function to add a new movie
  const addMovieToState = (newMovie: Movie) => {
    setNewMovies(prevMovies => [...prevMovies, newMovie]); 
  };

  return (
    <div className="App">
      <h1>Top Static Movie List</h1>
      <div className="movie-container">
        {staticMovies.map((movie, index) => (
          <div className="movie-card" key={index}>
            <img className="movie-poster" src={movie.Images[0]} alt={`${movie.Title} Poster`} />
            <div className="movie-details">
              <h3>{movie.Title}</h3>
              <p><strong>Year:</strong> {movie.Year}</p>
              <p><strong>Director:</strong> {movie.Director}</p>
              <p><strong>Plot:</strong> {movie.Plot}</p>
            </div>
          </div>
        ))}
      </div>

      <h1>Add New Movie</h1>
      <AddMovieForm onAddMovie={addMovieToState} /> {/* Pass the function to the form */}

      <h1>New Movies List</h1>
      <div className="movie-container">
        {newMovies.map((movie) => (
          <div className="movie-card" key={movie.id}>
            <img className="movie-poster" src={movie.Images[0]} alt={`${movie.Title} Poster`} />
            <div className="movie-details">
              <h3>{movie.Title}</h3>
              <p><strong>Year:</strong> {movie.Year}</p>
              <p><strong>Director:</strong> {movie.Director}</p>
              <p><strong>Plot:</strong> {movie.Plot}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
