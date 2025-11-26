import { getDatabase } from '../database/db';
import { CreateExpenseData, Expense, ExpenseByCategory, ExpenseByMonth, ExpenseCategory } from '../models/types';

export const createExpense = async (data: CreateExpenseData): Promise<Expense> => {
  try {
    // Validar dados antes de inserir
    if (!data.category || !['lazer', 'casa', 'estudos', 'transporte'].includes(data.category)) {
      throw new Error('Categoria inválida: ' + data.category);
    }
    
    if (typeof data.amount !== 'number' || isNaN(data.amount) || data.amount <= 0) {
      throw new Error('Valor inválido: ' + data.amount);
    }
    
    // Garantir que o banco está inicializado
    const database = await getDatabase();
    
    // Migrações já são executadas no início do app, não precisamos verificar aqui
    // Isso evita múltiplas tentativas de criar conexões simultâneas
    
    // Converter amount para número garantindo que é válido
    const amount = Number(data.amount);
    if (isNaN(amount) || !isFinite(amount) || amount <= 0) {
      throw new Error(`Valor inválido: ${data.amount} não pode ser convertido em número válido`);
    }
    
    // Garantir que o valor é um número real válido
    const amountValue = parseFloat(amount.toFixed(2));
    
    // Validar que os parâmetros estão corretos antes de inserir
    if (!data.category || typeof data.category !== 'string') {
      throw new Error('Categoria deve ser uma string válida');
    }
    
    if (typeof amountValue !== 'number' || !isFinite(amountValue)) {
      throw new Error(`Amount deve ser um número válido, recebido: ${amountValue} (${typeof amountValue})`);
    }
    
    // Garantir que os parâmetros são primitivos válidos
    const categoryParam = String(data.category).trim();
    const amountParam = parseFloat(amountValue.toString());
    
    // Validação final antes de inserir
    if (!categoryParam || categoryParam.length === 0) {
      throw new Error('Categoria não pode ser vazia');
    }
    
    if (isNaN(amountParam) || !isFinite(amountParam) || amountParam <= 0) {
      throw new Error(`Amount inválido após conversão: ${amountParam}`);
    }
    
    // Executar INSERT com parâmetros validados
    const result = await database.runAsync(
      'INSERT INTO expenses (category, amount) VALUES (?, ?)',
      [categoryParam, amountParam]
    );

    const lastInsertRowId = Number(result.lastInsertRowId);
    if (isNaN(lastInsertRowId) || lastInsertRowId <= 0) {
      throw new Error('ID inválido retornado após inserção');
    }

    const expense = await database.getFirstAsync<{
      id: number;
      category: string;
      amount: number;
      created_at: string;
    }>('SELECT * FROM expenses WHERE id = ?', [lastInsertRowId]);

    if (!expense) {
      throw new Error('Erro ao criar despesa: registro não encontrado após inserção');
    }

    return {
      id: expense.id,
      category: expense.category as ExpenseCategory,
      amount: expense.amount,
      createdAt: expense.created_at,
    };
  } catch (error) {
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

export const createExpenseWithDate = async (data: CreateExpenseData, date: string): Promise<Expense> => {
  // date deve estar no formato "YYYY-MM-DD HH:MM:SS" ou "YYYY-MM-DD"
  const database = await getDatabase();
  
  // Validar categoria
  if (!data.category || !['lazer', 'casa', 'estudos', 'transporte'].includes(data.category)) {
    throw new Error('Categoria inválida: ' + data.category);
  }
  
  const categoryParam = String(data.category).trim();
  const amountParam = Number(data.amount);
  
  if (isNaN(amountParam) || !isFinite(amountParam) || amountParam <= 0) {
    throw new Error('Valor inválido: ' + data.amount);
  }
  
  // Garantir formato correto da data
  let dateParam = date.trim();
  if (!dateParam.includes(' ')) {
    dateParam = `${dateParam} 12:00:00`;
  }
  
  // Validar formato da data (YYYY-MM-DD HH:MM:SS)
  const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  if (!dateRegex.test(dateParam)) {
    throw new Error(`Formato de data inválido: ${date}. Use YYYY-MM-DD ou YYYY-MM-DD HH:MM:SS`);
  }
  
  const result = await database.runAsync(
    'INSERT INTO expenses (category, amount, created_at) VALUES (?, ?, ?)',
    [categoryParam, amountParam, dateParam]
  );

  const expense = await database.getFirstAsync<{
    id: number;
    category: string;
    amount: number;
    created_at: string;
  }>('SELECT * FROM expenses WHERE id = ?', [Number(result.lastInsertRowId)]);

  if (!expense) {
    throw new Error('Erro ao criar despesa: registro não encontrado após inserção');
  }

  return {
    id: expense.id,
    category: expense.category as ExpenseCategory,
    amount: expense.amount,
    createdAt: expense.created_at,
  };
};

export const deleteExpense = async (id: number): Promise<void> => {
  try {
    if (!id || typeof id !== 'number' || isNaN(id) || id <= 0) {
      throw new Error(`ID inválido: ${id}`);
    }
    
    const database = await getDatabase();
    
    // Verificar se a despesa existe antes de deletar
    const existingExpense = await database.getFirstAsync<{ id: number }>(
      'SELECT id FROM expenses WHERE id = ?',
      [id]
    );
    
    if (!existingExpense) {
      throw new Error('Despesa não encontrada');
    }
    
    // Executar DELETE
    await database.runAsync('DELETE FROM expenses WHERE id = ?', [id]);
    
    // Verificar se foi realmente deletada
    const verifyExpense = await database.getFirstAsync<{ id: number }>(
      'SELECT id FROM expenses WHERE id = ?',
      [id]
    );
    
    if (verifyExpense) {
      throw new Error('Erro ao excluir despesa: registro ainda existe');
    }
  } catch (error) {
    throw error;
  }
};

export const updateExpense = async (id: number, data: CreateExpenseData): Promise<Expense> => {
  const database = await getDatabase();
  
  // Validar categoria
  if (!data.category || !['lazer', 'casa', 'estudos', 'transporte'].includes(data.category)) {
    throw new Error('Categoria inválida: ' + data.category);
  }
  
  // Validar valor
  const amountParam = Number(data.amount);
  if (isNaN(amountParam) || !isFinite(amountParam) || amountParam <= 0) {
    throw new Error('Valor inválido: ' + data.amount);
  }
  
  const categoryParam = String(data.category).trim();
  
  // Atualizar despesa
  await database.runAsync(
    'UPDATE expenses SET category = ?, amount = ? WHERE id = ?',
    [categoryParam, amountParam, id]
  );
  
  // Buscar despesa atualizada
  const expense = await database.getFirstAsync<{
    id: number;
    category: string;
    amount: number;
    created_at: string;
  }>('SELECT * FROM expenses WHERE id = ?', [id]);

  if (!expense) {
    throw new Error('Erro ao atualizar despesa: registro não encontrado após atualização');
  }

  return {
    id: expense.id,
    category: expense.category as ExpenseCategory,
    amount: expense.amount,
    createdAt: expense.created_at,
  };
};

export const getExpensesByMonth = async (): Promise<ExpenseByMonth[]> => {
  const database = await getDatabase();
  
  // Buscar despesas agrupadas por mês (formato YYYY-MM)
  const results = await database.getAllAsync<{
    month: string;
    total: number;
    count: number;
  }>(
    `SELECT 
      strftime('%Y-%m', created_at) as month,
      SUM(amount) as total,
      COUNT(*) as count
    FROM expenses 
    GROUP BY strftime('%Y-%m', created_at)
    ORDER BY month DESC`
  );

  // Converter para formato legível
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return results.map((row) => {
    const [year, month] = row.month.split('-');
    const monthIndex = parseInt(month) - 1;
    const monthName = monthNames[monthIndex];
    return {
      month: row.month,
      monthLabel: `${monthName} ${year}`,
      total: row.total,
      count: row.count,
    };
  });
};

export const getExpensesByMonthDate = async (month: string): Promise<Expense[]> => {
  // month deve estar no formato "YYYY-MM"
  const database = await getDatabase();
  const results = await database.getAllAsync<{
    id: number;
    category: string;
    amount: number;
    created_at: string;
  }>(
    `SELECT * FROM expenses 
     WHERE strftime('%Y-%m', created_at) = ?
     ORDER BY created_at DESC`,
    [month]
  );

  return results.map((row) => ({
    id: row.id,
    category: row.category as ExpenseCategory,
    amount: row.amount,
    createdAt: row.created_at,
  }));
};

export const getTotalExpensesByMonth = async (month: string): Promise<number> => {
  // month deve estar no formato "YYYY-MM"
  const database = await getDatabase();
  const result = await database.getFirstAsync<{ total: number }>(
    `SELECT SUM(amount) as total FROM expenses 
     WHERE strftime('%Y-%m', created_at) = ?`,
    [month]
  );

  return result?.total || 0;
};

export const deleteAllExpenses = async (): Promise<void> => {
  try {
    const database = await getDatabase();
    
    // Primeiro, contar quantas despesas existem
    const beforeCount = await database.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM expenses'
    );
    const countBefore = beforeCount?.count || 0;
    
    if (countBefore === 0) {
      return;
    }
    
    // Executar DELETE
    await database.runAsync('DELETE FROM expenses');
    
    // Aguardar um pouco para garantir que foi processado
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Verificar quantas linhas restam
    const afterCount = await database.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM expenses'
    );
    const countAfter = afterCount?.count || 0;
    
    if (countAfter > 0) {
      // Tentar deletar novamente
      await database.runAsync('DELETE FROM expenses');
    }
  } catch (error) {
    throw error;
  }
};

