import { useState, useEffect, useCallback } from 'react';
import { Expense, CreateExpenseData, ExpenseByCategory } from '../../backend/models/types';
import * as expenseService from '../../backend/services/expenseService';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expensesByCategory, setExpensesByCategory] = useState<ExpenseByCategory[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [expensesData, byCategory, total] = await Promise.all([
        expenseService.getExpenses(),
        expenseService.getExpensesByCategory(),
        expenseService.getTotalExpenses(),
      ]);
      setExpenses(expensesData);
      setExpensesByCategory(byCategory);
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
      await loadExpenses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar despesa');
      throw err;
    }
  }, [loadExpenses]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  return {
    expenses,
    expensesByCategory,
    totalExpenses,
    loading,
    error,
    addExpense,
    deleteExpense,
    refreshExpenses: loadExpenses,
  };
};

