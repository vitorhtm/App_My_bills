import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="minhas-dividas" options={{ title: 'Minhas dívidas' }} />
        <Stack.Screen name="minha-carteira" options={{ title: 'Minha carteira' }} />
        <Stack.Screen name="resumo-financeiro" />
        <Stack.Screen name="menu" />
        <Stack.Screen name="configuracoes" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
