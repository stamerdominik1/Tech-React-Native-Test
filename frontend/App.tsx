import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import Toast, { type ToastConfig } from 'react-native-toast-message';

import { ErrorToast, SuccessToast } from './src/components/CustomToasts';
import { colors } from './src/theme';

const toastConfig: ToastConfig = {
  error: ErrorToast,
  success: SuccessToast,
};
import FundraisersScreen from './src/screens/FundraisersScreen';
import FundraiserDetailScreen from './src/screens/FundraiserDetailScreen';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
  },
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={paperTheme}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.headerBackground,
            },
            headerTintColor: colors.headerText,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Fundraisers" 
            component={FundraisersScreen}
            options={{ title: 'Givebutter Fundraisers' }}
          />
          <Stack.Screen 
            name="FundraiserDetail" 
            component={FundraiserDetailScreen}
            options={{ title: 'Fundraiser Details' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} />
      </PaperProvider>
    </QueryClientProvider>
  );
}

