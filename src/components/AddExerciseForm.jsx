import { useState } from 'react';

const AddExerciseForm = ({ onAddExercise }) => {
  const [newExercise, setNewExercise] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newExercise.trim()) {
      onAddExercise(newExercise);
      setNewExercise('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={newExercise}
        onChange={(e) => setNewExercise(e.target.value)}
        placeholder="Novo exercício"
      />
      <button type="submit">Adicionar</button>
    </form>
  );
};

export default AddExerciseForm;
