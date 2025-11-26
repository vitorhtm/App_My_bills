import { getDatabase } from '../database/db';
import { CreateWalletData, Wallet } from '../models/types';

export const getWallet = async (): Promise<Wallet | null> => {
  const database = await getDatabase();
  const result = await database.getFirstAsync<{
    id: number;
    salary: number;
    emergency_reserve: number;
    updated_at: string;
  }>('SELECT * FROM wallet ORDER BY id DESC LIMIT 1');

  if (!result) {
    return null;
  }

  return {
    id: result.id,
    salary: result.salary,
    emergencyReserve: result.emergency_reserve,
    updatedAt: result.updated_at,
  };
};

export const updateWallet = async (data: CreateWalletData): Promise<Wallet> => {
  const database = await getDatabase();
  
  // Atualizar ou inserir
  const existing = await getWallet();
  
  if (existing) {
    await database.runAsync(
      'UPDATE wallet SET salary = ?, emergency_reserve = ?, updated_at = datetime("now") WHERE id = ?',
      [data.salary, data.emergencyReserve, existing.id]
    );
    return await getWallet() as Wallet;
  } else {
    const result = await database.runAsync(
      'INSERT INTO wallet (salary, emergency_reserve) VALUES (?, ?)',
      [data.salary, data.emergencyReserve]
    );
    const wallet = await getWallet();
    return wallet as Wallet;
  }
};

export const getTotalInWallet = async (): Promise<number> => {
  const wallet = await getWallet();
  if (!wallet) {
    return 0;
  }
  return wallet.salary + wallet.emergencyReserve;
};

export const resetWallet = async (): Promise<void> => {
  try {
    const database = await getDatabase();
    await database.runAsync('DELETE FROM wallet');
  } catch (error) {
    throw error;
  }
};

