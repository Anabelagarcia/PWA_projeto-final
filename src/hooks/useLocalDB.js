import { openDB } from 'idb';

// Nome do banco de dados e da store
const DB_NAME = 'diarioTreinosDB';
const STORE_NAME = 'exercicios';

// Função para inicializar o banco de dados
export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      // Cria a store se não existir
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    }
  });
};

// Função para adicionar um exercício ao banco de dados
export const addExercise = async (exercise) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.objectStore(STORE_NAME).add(exercise);
  return tx.done;
};

// Função para obter todos os exercícios armazenados
export const getExercises = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

// Função para deletar um exercício pelo ID
export const deleteExercise = async (id) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.objectStore(STORE_NAME).delete(id);
  return tx.done;
};

// Função para atualizar um exercício
export const updateExercise = async (exercise) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.objectStore(STORE_NAME).put(exercise);
  return tx.done;
};
