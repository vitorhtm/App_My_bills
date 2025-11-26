#!/usr/bin/env node

/**
 * Script para visualizar dados do banco SQLite
 * Funciona lendo diretamente do código do backend
 */

const path = require('path');

// Importar os services diretamente
async function viewDatabase() {
  try {
    // Simular ambiente do Expo
    const { getDatabase } = require('../backend/database/db');
    const expenseService = require('../backend/services/expenseService');
    const walletService = require('../backend/services/walletService');

    console.log('🔍 Conectando ao banco de dados...\n');

    // Verificar se o banco existe
    const db = await getDatabase();
    console.log('✅ Banco conectado!\n');

    // Buscar dados da carteira
    console.log('📊 DADOS DA CARTEIRA:');
    console.log('═'.repeat(60));
    const wallet = await walletService.getWallet();
    if (wallet) {
      console.log(`ID: ${wallet.id}`);
      console.log(`Salário: R$ ${wallet.salary.toFixed(2)}`);
      console.log(`Reserva de Emergência: R$ ${wallet.emergencyReserve.toFixed(2)}`);
      console.log(`Total: R$ ${(wallet.salary + wallet.emergencyReserve).toFixed(2)}`);
      console.log(`Última atualização: ${wallet.updatedAt}`);
    } else {
      console.log('(Nenhum registro encontrado)');
    }

    console.log('\n📊 TODAS AS DESPESAS:');
    console.log('═'.repeat(60));
    const expenses = await expenseService.getExpenses();
    if (expenses.length > 0) {
      console.log('ID | Categoria      | Valor      | Data/Hora');
      console.log('-'.repeat(60));
      expenses.forEach((exp) => {
        const category = exp.category.padEnd(14);
        const amount = `R$ ${exp.amount.toFixed(2)}`.padEnd(10);
        const date = new Date(exp.createdAt).toLocaleString('pt-BR');
        console.log(`${exp.id.toString().padEnd(2)} | ${category} | ${amount} | ${date}`);
      });
    } else {
      console.log('(Nenhuma despesa encontrada)');
    }

    console.log('\n📊 RESUMO POR CATEGORIA:');
    console.log('═'.repeat(60));
    const byCategory = await expenseService.getExpensesByCategory();
    if (byCategory.length > 0) {
      console.log('Categoria      | Total       | Percentual');
      console.log('-'.repeat(60));
      byCategory.forEach((item) => {
        const category = item.category.padEnd(14);
        const total = `R$ ${item.total.toFixed(2)}`.padEnd(11);
        const percentage = `${item.percentage.toFixed(1)}%`;
        console.log(`${category} | ${total} | ${percentage}`);
      });
    } else {
      console.log('(Nenhuma categoria encontrada)');
    }

    console.log('\n📊 TOTAL GERAL:');
    console.log('═'.repeat(60));
    const total = await expenseService.getTotalExpenses();
    console.log(`Total de despesas: R$ ${total.toFixed(2)}`);
    console.log(`Quantidade de registros: ${expenses.length}`);

    console.log('\n✅ Dados exibidos com sucesso!');
    
    // Fechar conexão
    const { closeDatabase } = require('../backend/database/db');
    await closeDatabase();
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao acessar banco:', error.message);
    console.error('\n💡 Nota: Este script precisa rodar em ambiente Node.js com expo-sqlite.');
    console.error('   Se estiver usando Expo Web, o banco está em IndexedDB.');
    console.error('   Use a tela de Configurações no app para ver os dados.\n');
    process.exit(1);
  }
}

viewDatabase();


