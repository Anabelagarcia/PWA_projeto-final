// src/components/Home.jsx
import { useState, useEffect } from 'react';
import { getExercises, addExercise } from '../hooks/useLocalDB';

const Home = () => {
  const [exercises, setExercises] = useState([]);
  const [newExercise, setNewExercise] = useState('');

  useEffect(() => {
    const fetchExercises = async () => {
      setExercises(await getExercises());
    };
    fetchExercises();
  }, []);

  const handleAddExercise = async () => {
    if (newExercise.trim()) {
      await addExercise({ name: newExercise });
      setExercises(await getExercises());
      setNewExercise('');
    }
  };

  return (
    <div>
      <h1>Diário de Treinos</h1>
      <input
        type="text"
        value={newExercise}
        onChange={(e) => setNewExercise(e.target.value)}
        placeholder="Novo exercício"
      />
      <button onClick={handleAddExercise}>Adicionar</button>
      <ul>
        {exercises.map((ex, index) => (
          <li key={index}>{ex.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
