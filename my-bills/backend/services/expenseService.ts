import { getDatabase } from '../database/db';
import { CreateExpenseData, Expense, ExpenseByCategory, ExpenseCategory } from '../models/types';

export const createExpense = async (data: CreateExpenseData): Promise<Expense> => {
  try {
    console.log('createExpense - Dados recebidos:', data);
    const database = await getDatabase();
    console.log('createExpense - Banco conectado');
    
    const result = await database.runAsync(
      'INSERT INTO expenses (category, amount) VALUES (?, ?)',
      [data.category, data.amount]
    );
    console.log('createExpense - INSERT executado, lastInsertRowId:', result.lastInsertRowId);

    const expense = await database.getFirstAsync<{
      id: number;
      category: string;
      amount: number;
      created_at: string;
    }>('SELECT * FROM expenses WHERE id = ?', [Number(result.lastInsertRowId)]);

    if (!expense) {
      console.error('createExpense - Despesa não encontrada após inserção');
      throw new Error('Erro ao criar despesa: registro não encontrado após inserção');
    }

    console.log('createExpense - Despesa criada com sucesso:', expense);
    return {
      id: expense.id,
      category: expense.category as ExpenseCategory,
      amount: expense.amount,
      createdAt: expense.created_at,
    };
  } catch (error) {
    console.error('createExpense - Erro:', error);
    throw error;
  }
};

export const getExpenses = async (): Promise<Expense[]> => {
  const database = await getDatabase();
  const results = await database.getAllAsync<{
    id: number;
    category: string;
    amount: number;
    created_at: string;
  }>('SELECT * FROM expenses ORDER BY created_at DESC');

  return results.map((row) => ({
    id: row.id,
    category: row.category as ExpenseCategory,
    amount: row.amount,
    createdAt: row.created_at,
  }));
};

export const getExpensesByCategory = async (): Promise<ExpenseByCategory[]> => {
  const database = await getDatabase();
  const results = await database.getAllAsync<{
    category: string;
    total: number;
  }>(
    'SELECT category, SUM(amount) as total FROM expenses GROUP BY category'
  );

  const totalExpenses = results.reduce((sum, row) => sum + row.total, 0);

  return results.map((row) => ({
    category: row.category as ExpenseCategory,
    total: row.total,
    percentage: totalExpenses > 0 ? (row.total / totalExpenses) * 100 : 0,
  }));
};

export const getTotalExpenses = async (): Promise<number> => {
  const database = await getDatabase();
  const result = await database.getFirstAsync<{ total: number }>(
    'SELECT SUM(amount) as total FROM expenses'
  );

  return result?.total || 0;
};

export const deleteExpense = async (id: number): Promise<void> => {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM expenses WHERE id = ?', [id]);
};

