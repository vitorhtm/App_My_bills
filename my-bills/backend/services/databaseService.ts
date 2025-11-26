import { getDatabase, closeDatabase } from '../database/db';
import { deleteAllExpenses } from './expenseService';
import { resetWallet } from './walletService';

/**
 * Limpa todo o banco de dados
 * - Deleta todas as despesas
 * - Reseta a carteira para valores zero
 */
export const clearAllData = async (): Promise<void> => {
  try {
    const database = await getDatabase();
    
    // Limpar despesas primeiro
    await deleteAllExpenses();
    
    // Pequeno delay para garantir que a operação foi completada
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Deletar carteira
    await resetWallet();
  } catch (error) {
    throw error;
  }
};

/**
 * Limpa apenas as despesas, mantendo a carteira
 */
export const clearExpensesOnly = async (): Promise<void> => {
  await deleteAllExpenses();
};

/**
 * Reseta apenas a carteira, mantendo as despesas
 */
export const clearWalletOnly = async (): Promise<void> => {
  await resetWallet();
};

/**
 * Função direta e simples: limpa tudo
 */
export const clearDatabase = async (): Promise<void> => {
  const database = await getDatabase();
  
  try {
    // Deletar todas as despesas
    await database.runAsync('DELETE FROM expenses');
    
    // Aguardar um pouco
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Deletar tudo da wallet (não recriar - será criada quando o usuário adicionar valores)
    await database.runAsync('DELETE FROM wallet');
    
    // Aguardar mais um pouco para garantir que foi processado
    await new Promise(resolve => setTimeout(resolve, 100));
  } catch (error) {
    throw error;
  }
};

