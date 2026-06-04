import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StoreProvider } from '../data/store';

if (typeof globalThis.fetch === 'undefined') {
  // @ts-ignore
  globalThis.fetch = fetch;
}

export default function RootLayout() {
  return (
    <StoreProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="bike/[id]" />
        <Stack.Screen name="rental-start" options={{ presentation: 'modal' }} />
        <Stack.Screen name="active-rental" />
        <Stack.Screen name="history" />
        <Stack.Screen name="device-setup" />
        <Stack.Screen name="rider" />

      </Stack>
    </StoreProvider>
  );
}
