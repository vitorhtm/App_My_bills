import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { runMigrations } from '../backend/database/migrations';
import * as expenseService from '../backend/services/expenseService';
import * as walletService from '../backend/services/walletService';
import { ThemeProvider } from './theme-context';

export default function RootLayout() {
  useEffect(() => {
    // Inicializar banco de dados ao iniciar o app
    runMigrations().catch((error) => {
      // Erro silencioso ao inicializar banco
    });

    // Função global para acessar o banco pelo console
    if (typeof window !== 'undefined') {
      (window as any).viewDatabase = async () => {
        try {
          const wallet = await walletService.getWallet();
          const expenses = await expenseService.getExpenses();
          const byCategory = await expenseService.getExpensesByCategory();
          const total = await expenseService.getTotalExpenses();
          return { wallet, expenses, byCategory, total };
        } catch (error) {
          throw error;
        }
      };

      // Função síncrona que executa a async e mostra resultado
      (window as any).db = {
        async view() {
          return await (window as any).viewDatabase();
        },
        async wallet() {
          const wallet = await walletService.getWallet();
          return wallet;
        },
        async expenses() {
          const expenses = await expenseService.getExpenses();
          return expenses;
        },
        async summary() {
          const summary = await expenseService.getExpensesByCategory();
          return summary;
        },
      };

      // Função que executa automaticamente (sem precisar de await)
      (window as any).dbView = () => {
        (async () => {
          try {
            await (window as any).viewDatabase();
          } catch (error) {
            // Erro silencioso
          }
        })();
      };

      // Função simples para limpar o banco
      (window as any).clearDB = async () => {
        try {
          const { clearDatabase } = await import('../backend/services/databaseService');
          await clearDatabase();
        } catch (error) {
          throw error;
        }
      };

      // Função para adicionar dados de exemplo de setembro
      (window as any).addSeptemberData = async () => {
        try {
          const { createExpenseWithDate } = await import('../backend/services/expenseService');
          const currentYear = new Date().getFullYear();
          
          // Adicionar algumas despesas de setembro
          const septemberExpenses: Array<{ category: 'lazer' | 'casa' | 'estudos' | 'transporte', amount: number, date: string }> = [
            { category: 'lazer', amount: 250, date: `${currentYear}-09-05` },
            { category: 'casa', amount: 1200, date: `${currentYear}-09-10` },
            { category: 'estudos', amount: 350, date: `${currentYear}-09-15` },
            { category: 'transporte', amount: 180, date: `${currentYear}-09-20` },
            { category: 'lazer', amount: 150, date: `${currentYear}-09-25` },
            { category: 'casa', amount: 450, date: `${currentYear}-09-28` },
          ];
          
          for (const exp of septemberExpenses) {
            await createExpenseWithDate(
              { category: exp.category, amount: exp.amount },
              exp.date
            );
          }
        } catch (error) {
          throw error;
        }
      };
    }
  }, []);

  return (
    <ThemeProvider>
      <StatusBar style="light" />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="minhas-dividas" options={{ title: 'Minhas dívidas' }} />
        <Stack.Screen name="minha-carteira" options={{ title: 'Minha carteira' }} />
        <Stack.Screen name="resumo-financeiro" />
        <Stack.Screen name="menu" />
        <Stack.Screen name="configuracoes" />
      </Stack>
    </ThemeProvider>
  );
}
