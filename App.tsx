import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from '@/context/AuthContext';
import Login from '@/screens/Login';
import Dashboard from '@/screens/Dashboard';
import Scanner from '@/screens/Scanner';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Scanner" component={Scanner} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
