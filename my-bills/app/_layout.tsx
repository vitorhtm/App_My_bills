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
      console.error('Erro ao inicializar banco de dados:', error);
    });

    // Função global para acessar o banco pelo console
    if (typeof window !== 'undefined') {
      (window as any).viewDatabase = async () => {
        try {
          console.log('\n📊 DADOS DA CARTEIRA:');
          console.log('═'.repeat(60));
          const wallet = await walletService.getWallet();
          if (wallet) {
            console.table({
              ID: wallet.id,
              Salário: `R$ ${wallet.salary.toFixed(2)}`,
              'Reserva de Emergência': `R$ ${wallet.emergencyReserve.toFixed(2)}`,
              Total: `R$ ${(wallet.salary + wallet.emergencyReserve).toFixed(2)}`,
              'Última atualização': wallet.updatedAt,
            });
          } else {
            console.log('(Nenhum registro)');
          }

          console.log('\n📊 TODAS AS DESPESAS:');
          console.log('═'.repeat(60));
          const expenses = await expenseService.getExpenses();
          if (expenses.length > 0) {
            console.table(expenses);
          } else {
            console.log('(Nenhuma despesa)');
          }

          console.log('\n📊 RESUMO POR CATEGORIA:');
          console.log('═'.repeat(60));
          const byCategory = await expenseService.getExpensesByCategory();
          if (byCategory.length > 0) {
            console.table(byCategory);
          } else {
            console.log('(Nenhuma categoria)');
          }

          console.log('\n📊 TOTAL GERAL:');
          console.log('═'.repeat(60));
          const total = await expenseService.getTotalExpenses();
          console.log(`Total: R$ ${total.toFixed(2)}`);
          console.log(`Quantidade: ${expenses.length} despesas`);

          console.log('\n✅ Dados exibidos!');
          return { wallet, expenses, byCategory, total };
        } catch (error) {
          console.error('❌ Erro:', error);
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
          console.table(wallet);
          return wallet;
        },
        async expenses() {
          const expenses = await expenseService.getExpenses();
          console.table(expenses);
          return expenses;
        },
        async summary() {
          const summary = await expenseService.getExpensesByCategory();
          console.table(summary);
          return summary;
        },
      };

      // Função que executa automaticamente (sem precisar de await)
      (window as any).dbView = () => {
        (async () => {
          try {
            console.log('\n📊 DADOS DA CARTEIRA:');
            console.log('═'.repeat(60));
            const wallet = await walletService.getWallet();
            if (wallet) {
              console.table({
                ID: wallet.id,
                Salário: `R$ ${wallet.salary.toFixed(2)}`,
                'Reserva de Emergência': `R$ ${wallet.emergencyReserve.toFixed(2)}`,
                Total: `R$ ${(wallet.salary + wallet.emergencyReserve).toFixed(2)}`,
                'Última atualização': wallet.updatedAt,
              });
            } else {
              console.log('(Nenhum registro)');
            }

            console.log('\n📊 TODAS AS DESPESAS:');
            console.log('═'.repeat(60));
            const expenses = await expenseService.getExpenses();
            if (expenses.length > 0) {
              console.table(expenses);
            } else {
              console.log('(Nenhuma despesa)');
            }

            console.log('\n📊 RESUMO POR CATEGORIA:');
            console.log('═'.repeat(60));
            const byCategory = await expenseService.getExpensesByCategory();
            if (byCategory.length > 0) {
              console.table(byCategory);
            } else {
              console.log('(Nenhuma categoria)');
            }

            console.log('\n📊 TOTAL GERAL:');
            console.log('═'.repeat(60));
            const total = await expenseService.getTotalExpenses();
            console.log(`Total: R$ ${total.toFixed(2)}`);
            console.log(`Quantidade: ${expenses.length} despesas`);

            console.log('\n✅ Dados exibidos!');
          } catch (error) {
            console.error('❌ Erro:', error);
          }
        })();
      };

      console.log('\n💡 Dicas para ver dados do banco:');
      console.log('   - dbView() - Ver tudo (RECOMENDADO - sem await)');
      console.log('   - await viewDatabase() - Ver tudo (com await)');
      console.log('   - await db.wallet() - Ver carteira');
      console.log('   - await db.expenses() - Ver despesas');
      console.log('   - await db.summary() - Ver resumo\n');
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
