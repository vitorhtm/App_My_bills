import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './theme-context';

export default function RootLayout() {
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
