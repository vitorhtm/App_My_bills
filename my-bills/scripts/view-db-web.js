#!/usr/bin/env node

/**
 * Script para copiar e colar no console do navegador
 * para visualizar dados do banco SQLite no Expo Web
 */

const script = `
// ============================================
// COLE ESTE CÓDIGO NO CONSOLE DO NAVEGADOR
// ============================================

(async function() {
  try {
    const SQLite = await import('expo-sqlite');
    const db = await SQLite.openDatabaseAsync('mybills.db');
    
    console.log('\\n📊 DADOS DA CARTEIRA:');
    console.log('═'.repeat(60));
    const wallet = await db.getFirstAsync('SELECT * FROM wallet ORDER BY id DESC LIMIT 1');
    if (wallet) {
      console.table(wallet);
    } else {
      console.log('(Nenhum registro)');
    }
    
    console.log('\\n📊 TODAS AS DESPESAS:');
    console.log('═'.repeat(60));
    const expenses = await db.getAllAsync('SELECT * FROM expenses ORDER BY created_at DESC');
    if (expenses.length > 0) {
      console.table(expenses);
    } else {
      console.log('(Nenhuma despesa)');
    }
    
    console.log('\\n📊 RESUMO POR CATEGORIA:');
    console.log('═'.repeat(60));
    const summary = await db.getAllAsync(
      'SELECT category, SUM(amount) as total, COUNT(*) as count FROM expenses GROUP BY category'
    );
    if (summary.length > 0) {
      console.table(summary);
    } else {
      console.log('(Nenhuma categoria)');
    }
    
    console.log('\\n📊 TOTAL GERAL:');
    console.log('═'.repeat(60));
    const total = await db.getFirstAsync('SELECT SUM(amount) as total FROM expenses');
    console.log('Total:', total?.total || 0);
    console.log('Quantidade:', expenses.length);
    
    console.log('\\n✅ Dados exibidos!');
  } catch (error) {
    console.error('❌ Erro:', error);
  }
})();
`;

console.log(script);
console.log('\n📋 INSTRUÇÕES:');
console.log('1. Abra o app no navegador');
console.log('2. Abra o Console (F12 ou Cmd+Option+I)');
console.log('3. Cole o código acima no console');
console.log('4. Pressione Enter\n');


