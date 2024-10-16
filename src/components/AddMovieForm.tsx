import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

interface AddMovieFormProps {
  onAddMovie: (newMovie: { id: string; Title: string; Year: string; Director: string; Plot: string; Images: string[] }) => void;
}

const AddMovieForm: React.FC<AddMovieFormProps> = ({ onAddMovie }) => {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [director, setDirector] = useState('');
  const [plot, setPlot] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setImageFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLFormElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          setImageFiles((prev) => [...prev, file]);
        }
      }
    }
  };

  const addMovie = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const imageUrls = await uploadImages();

      const docRef = await addDoc(collection(db, 'movies'), {
        Title: title,
        Year: year,
        Director: director,
        Plot: plot,
        Images: imageUrls.length > 0 ? imageUrls : ['default-image-url.jpg'],
      });

      setTitle('');
      setYear('');
      setDirector('');
      setPlot('');
      setImageFiles([]);

      onAddMovie({ id: docRef.id, Title: title, Year: year, Director: director, Plot: plot, Images: imageUrls });

      alert('Movie added successfully!');
    } catch (error) {
      console.error('Error adding movie:', error);
      alert('Failed to add movie');
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    return Promise.resolve(imageFiles.map(file => URL.createObjectURL(file)));
  };

  return (
    <form
      style={{
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
      }}
      onSubmit={addMovie}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onPaste={handlePaste}
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{
          padding: '10px',
          fontSize: '1rem',
          border: 'none',
          borderRadius: '5px',
          backgroundColor: '#1e1e1e',
          color: '#ffffff',
        }}
      />
      <input
        type="text"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        required
        style={{
          padding: '10px',
          fontSize: '1rem',
          border: 'none',
          borderRadius: '5px',
          backgroundColor: '#1e1e1e',
          color: '#ffffff',
        }}
      />
      <input
        type="text"
        placeholder="Director"
        value={director}
        onChange={(e) => setDirector(e.target.value)}
        required
        style={{
          padding: '10px',
          fontSize: '1rem',
          border: 'none',
          borderRadius: '5px',
          backgroundColor: '#1e1e1e',
          color: '#ffffff',
        }}
      />
      <textarea
        placeholder="Plot"
        value={plot}
        onChange={(e) => setPlot(e.target.value)}
        required
        style={{
          padding: '10px',
          fontSize: '1rem',
          border: 'none',
          borderRadius: '5px',
          backgroundColor: '#1e1e1e',
          color: '#ffffff',
        }}
      />
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
        style={{
          padding: '10px',
          borderRadius: '5px',
          backgroundColor: '#1e1e1e',
          color: '#ffffff',
        }}
      />
      <div className="image-preview" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {imageFiles.map((file, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img
              src={URL.createObjectURL(file)}
              alt={`preview-${index}`}
              style={{ width: '100px', height: 'auto', borderRadius: '5px', marginBottom: '5px' }}
            />
            <p style={{ color: '#ffffff', textAlign: 'center' }}>{file.name}</p>
          </div>
        ))}
      </div>
      <button
        type="submit"
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
        Add Movie
      </button>
    </form>
  );
};

export default AddMovieForm;
