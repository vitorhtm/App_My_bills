import { getDatabase } from './db';

export const runMigrations = async (): Promise<void> => {
  const database = await getDatabase();

  // Criar tabela wallet
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS wallet (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      salary REAL NOT NULL DEFAULT 0,
      emergency_reserve REAL NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Criar tabela expenses
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL CHECK(category IN ('lazer', 'casa', 'estudos', 'transporte')),
      amount REAL NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Inserir registro inicial na wallet se não existir
  const walletResult = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM wallet'
  );

  if (walletResult && walletResult.count === 0) {
    await database.runAsync(
      'INSERT INTO wallet (salary, emergency_reserve) VALUES (0, 0)'
    );
  }
};

