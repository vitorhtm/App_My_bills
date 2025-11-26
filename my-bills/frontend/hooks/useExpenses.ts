import { useState, useEffect, useCallback } from 'react';
import { Expense, CreateExpenseData, ExpenseByCategory, ExpenseByMonth } from '../../backend/models/types';
import * as expenseService from '../../backend/services/expenseService';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expensesByCategory, setExpensesByCategory] = useState<ExpenseByCategory[]>([]);
  const [expensesByMonth, setExpensesByMonth] = useState<ExpenseByMonth[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [expensesData, byCategory, byMonth, total] = await Promise.all([
        expenseService.getExpenses(),
        expenseService.getExpensesByCategory(),
        expenseService.getExpensesByMonth(),
        expenseService.getTotalExpenses(),
      ]);
      setExpenses(expensesData);
      setExpensesByCategory(byCategory);
      setExpensesByMonth(byMonth);
      setTotalExpenses(total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar despesas');
    } finally {
      setLoading(false);
    }
  }, []);

  const addExpense = useCallback(async (data: CreateExpenseData) => {
    try {
      setError(null);
      const newExpense = await expenseService.createExpense(data);
      await loadExpenses();
      return newExpense;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar despesa');
      throw err;
    }
  }, [loadExpenses]);

  const deleteExpense = useCallback(async (id: number) => {
    try {
      setError(null);
      await expenseService.deleteExpense(id);
      
      // Pequeno delay para garantir que o banco processou a transação
      await new Promise(resolve => setTimeout(resolve, 50));
      
      await loadExpenses();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar despesa';
      setError(errorMessage);
      throw err;
    }
  }, [loadExpenses]);

  const updateExpense = useCallback(async (id: number, data: CreateExpenseData) => {
    try {
      setError(null);
      const updatedExpense = await expenseService.updateExpense(id, data);
      await loadExpenses();
      return updatedExpense;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar despesa');
      throw err;
    }
  }, [loadExpenses]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  return {
    expenses,
    expensesByCategory,
    expensesByMonth,
    totalExpenses,
    loading,
    error,
    addExpense,
    deleteExpense,
    updateExpense,
    refreshExpenses: loadExpenses,
  };
};

