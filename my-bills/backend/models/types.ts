export type ExpenseCategory = 'lazer' | 'casa' | 'estudos' | 'transporte';

export interface Wallet {
  id: number;
  salary: number;
  emergencyReserve: number;
  updatedAt: string;
}

export interface Expense {
  id: number;
  category: ExpenseCategory;
  amount: number;
  createdAt: string;
}

export interface CreateWalletData {
  salary: number;
  emergencyReserve: number;
}

export interface CreateExpenseData {
  category: ExpenseCategory;
  amount: number;
}

export interface ExpenseByCategory {
  category: ExpenseCategory;
  total: number;
  percentage: number;
}

export interface ExpenseByMonth {
  month: string; // Formato: "YYYY-MM" (ex: "2024-01")
  monthLabel: string; // Formato legível (ex: "Janeiro 2024")
  total: number;
  count: number;
}

