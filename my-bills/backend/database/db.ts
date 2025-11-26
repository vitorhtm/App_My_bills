import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) {
    return db;
  }

  try {
    console.log('getDatabase - Abrindo conexão com banco de dados...');
    db = await SQLite.openDatabaseAsync('mybills.db');
    console.log('getDatabase - Banco de dados conectado com sucesso');
    return db;
  } catch (error) {
    console.error('getDatabase - Erro ao conectar:', error);
    throw error;
  }
};

export const closeDatabase = async (): Promise<void> => {
  if (db) {
    await db.closeAsync();
    db = null;
  }
};

