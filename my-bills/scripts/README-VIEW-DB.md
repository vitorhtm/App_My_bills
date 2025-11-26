# Como Visualizar o Banco de Dados SQLite

## 🚀 Método Rápido (Recomendado)

### Via Console do Navegador/App

1. Abra o app no navegador ou dispositivo
2. Abra o Console do Desenvolvedor (F12 ou Cmd+Option+I)
3. No console, execute:

```javascript
// Ver todas as despesas
const { getDatabase } = require('./backend/database/db');
const db = await getDatabase();
const expenses = await db.getAllAsync('SELECT * FROM expenses');
console.table(expenses);

// Ver carteira
const wallet = await db.getFirstAsync('SELECT * FROM wallet');
console.table(wallet);
```

## 📱 Por Plataforma

### Web (Expo Web)
O SQLite no web usa **IndexedDB**, não é um arquivo `.db` tradicional.

**Opção 1: Console do Navegador**
1. Abra DevTools (F12)
2. Vá em Application > IndexedDB
3. Procure por `expo-sqlite` ou `mybills.db`

**Opção 2: Usar o App**
- Acesse a tela de **Configurações** no app
- Todos os dados estarão visíveis lá

### iOS Simulator

```bash
# 1. Encontrar o ID do app
xcrun simctl listapps booted | grep -i mybills

# 2. Obter o caminho do container
xcrun simctl get_app_container booted com.expo.mybills data

# 3. Navegar até a pasta Documents
cd "$(xcrun simctl get_app_container booted com.expo.mybills data)/Documents"

# 4. Ver o banco
sqlite3 mybills.db "SELECT * FROM expenses;"
sqlite3 mybills.db "SELECT * FROM wallet;"
```

### Android Emulator

```bash
# 1. Conectar ao emulador
adb shell

# 2. Navegar até o banco (dentro do shell)
cd /data/data/com.expo.mybills/databases/
ls -la

# 3. Ver o banco
sqlite3 mybills.db "SELECT * FROM expenses;"
sqlite3 mybills.db "SELECT * FROM wallet;"
```

## 🛠️ Queries Úteis

```sql
-- Ver todas as despesas
SELECT * FROM expenses ORDER BY created_at DESC;

-- Ver despesas por categoria
SELECT category, SUM(amount) as total, COUNT(*) as count 
FROM expenses 
GROUP BY category;

-- Ver total geral
SELECT SUM(amount) as total FROM expenses;

-- Ver carteira
SELECT * FROM wallet;

-- Ver últimas 10 despesas
SELECT * FROM expenses ORDER BY created_at DESC LIMIT 10;
```

## 💡 Dica

A forma mais fácil é usar a **tela de Configurações** no app, que mostra todos os dados de forma organizada!


