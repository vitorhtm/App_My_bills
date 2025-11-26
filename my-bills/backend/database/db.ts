import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  // Se já temos a conexão, retornar diretamente
  if (db) {
    return db;
  }

  // Se já estamos abrindo uma conexão, aguardar ela
  if (dbPromise) {
    return await dbPromise;
  }

  // Criar nova promise para abrir o banco
  dbPromise = (async () => {
    try {
      const database = await SQLite.openDatabaseAsync('mybills.db');
      db = database;
      dbPromise = null; // Limpar a promise
      return db;
    } catch (error) {
      dbPromise = null; // Limpar a promise em caso de erro
      throw error;
    }
  })();

  return await dbPromise;
};

export const closeDatabase = async (): Promise<void> => {
  if (db) {
    await db.closeAsync();
    db = null;
  }
};

