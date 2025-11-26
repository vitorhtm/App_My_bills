#!/usr/bin/env node

/**
 * Script para visualizar dados do banco SQLite pelo terminal
 * 
 * Uso:
 *   node scripts/view-database.js
 * 
 * Nota: O banco SQLite do Expo fica em locais diferentes:
 * - Web: pode não estar acessível diretamente
 * - iOS Simulator: ~/Library/Developer/CoreSimulator/Devices/[DEVICE_ID]/data/Containers/Data/Application/[APP_ID]/Documents/
 * - Android Emulator: /data/data/[PACKAGE_NAME]/databases/
 * 
 * Para encontrar o arquivo, procure por "mybills.db" no sistema de arquivos
 */

const fs = require('fs');
const path = require('path');

// Possíveis locais do banco (dependendo da plataforma)
const possiblePaths = [
  // Web (se estiver usando IndexedDB, não funciona assim)
  path.join(__dirname, '../mybills.db'),
  path.join(process.cwd(), 'mybills.db'),
  
  // iOS Simulator (exemplo)
  path.join(process.env.HOME, 'Library/Developer/CoreSimulator/Devices'),
  
  // Android (precisa de acesso root ou adb)
];

console.log('🔍 Procurando banco de dados SQLite...\n');

// Função para procurar arquivo recursivamente
function findDatabaseFile(dir, maxDepth = 3, currentDepth = 0) {
  if (currentDepth >= maxDepth) return null;
  
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isFile() && file === 'mybills.db') {
          return fullPath;
        } else if (stat.isDirectory() && !file.startsWith('.') && !file.startsWith('node_modules')) {
          const found = findDatabaseFile(fullPath, maxDepth, currentDepth + 1);
          if (found) return found;
        }
      } catch (e) {
        // Ignorar erros de permissão
      }
    }
  } catch (e) {
    // Ignorar erros
  }
  return null;
}

// Tentar encontrar o banco
let dbPath = null;

// Primeiro, tentar locais comuns
for (const possiblePath of possiblePaths) {
  if (fs.existsSync(possiblePath) && fs.statSync(possiblePath).isFile()) {
    dbPath = possiblePath;
    break;
  }
}

// Se não encontrou, procurar recursivamente (limitado)
if (!dbPath) {
  console.log('Procurando em locais comuns...');
  dbPath = findDatabaseFile(process.cwd(), 2);
}

if (!dbPath) {
  console.log('❌ Banco de dados não encontrado automaticamente.\n');
  console.log('📝 Para acessar o banco SQLite do Expo:\n');
  console.log('1. WEB:');
  console.log('   - O SQLite no web usa IndexedDB, não é acessível diretamente');
  console.log('   - Use a tela de Configurações no app para ver os dados\n');
  
  console.log('2. iOS Simulator:');
  console.log('   - Abra o Simulator');
  console.log('   - Execute: xcrun simctl get_app_container booted com.expo.mybills data');
  console.log('   - Procure por mybills.db na pasta Documents\n');
  
  console.log('3. Android Emulator:');
  console.log('   - Execute: adb shell');
  console.log('   - Navegue até: /data/data/com.expo.mybills/databases/');
  console.log('   - Execute: sqlite3 mybills.db\n');
  
  console.log('4. Alternativa - Usar o app:');
  console.log('   - Acesse a tela de Configurações no app');
  console.log('   - Todos os dados estarão visíveis lá\n');
  
  process.exit(1);
}

console.log(`✅ Banco encontrado em: ${dbPath}\n`);

// Tentar usar sqlite3 se disponível
const { execSync } = require('child_process');

try {
  console.log('📊 Dados da tabela WALLET:');
  console.log('─'.repeat(60));
  const walletData = execSync(`sqlite3 "${dbPath}" "SELECT * FROM wallet;"`, { encoding: 'utf-8' });
  if (walletData.trim()) {
    console.log('ID | Salary | Emergency Reserve | Updated At');
    console.log('-'.repeat(60));
    walletData.split('\n').forEach(line => {
      if (line.trim()) {
        const [id, salary, reserve, updated] = line.split('|');
        console.log(`${id || 'N/A'} | ${salary || '0'} | ${reserve || '0'} | ${updated || 'N/A'}`);
      }
    });
  } else {
    console.log('(Nenhum registro)');
  }
  
  console.log('\n📊 Dados da tabela EXPENSES:');
  console.log('─'.repeat(60));
  const expensesData = execSync(`sqlite3 "${dbPath}" "SELECT * FROM expenses ORDER BY created_at DESC;"`, { encoding: 'utf-8' });
  if (expensesData.trim()) {
    console.log('ID | Category | Amount | Created At');
    console.log('-'.repeat(60));
    expensesData.split('\n').forEach(line => {
      if (line.trim()) {
        const [id, category, amount, created] = line.split('|');
        console.log(`${id || 'N/A'} | ${category || 'N/A'} | ${amount || '0'} | ${created || 'N/A'}`);
      }
    });
  } else {
    console.log('(Nenhum registro)');
  }
  
  console.log('\n📊 Resumo por Categoria:');
  console.log('─'.repeat(60));
  const summary = execSync(`sqlite3 "${dbPath}" "SELECT category, SUM(amount) as total, COUNT(*) as count FROM expenses GROUP BY category;"`, { encoding: 'utf-8' });
  if (summary.trim()) {
    console.log('Category | Total | Count');
    console.log('-'.repeat(60));
    summary.split('\n').forEach(line => {
      if (line.trim()) {
        const [category, total, count] = line.split('|');
        console.log(`${category || 'N/A'} | ${total || '0'} | ${count || '0'}`);
      }
    });
  } else {
    console.log('(Nenhum registro)');
  }
  
  console.log('\n✅ Dados exibidos com sucesso!');
  console.log('\n💡 Dica: Para executar queries customizadas:');
  console.log(`   sqlite3 "${dbPath}" "SUA_QUERY_AQUI"`);
  
} catch (error) {
  if (error.message.includes('sqlite3: command not found')) {
    console.log('❌ sqlite3 não está instalado.\n');
    console.log('📦 Para instalar no macOS:');
    console.log('   brew install sqlite3\n');
    console.log('📦 Ou use Node.js com better-sqlite3:');
    console.log('   npm install better-sqlite3\n');
    console.log('💡 Alternativa: Use a tela de Configurações no app para ver os dados.');
  } else {
    console.error('❌ Erro ao acessar banco:', error.message);
  }
  process.exit(1);
}


