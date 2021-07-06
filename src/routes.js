import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// import Home from './pages/Home';
import Users from './pages/Users';
import DashboardRoutes from './routes/dashboard.routes';
import SignIn from './pages/signIn';
import Main from './pages/main';

export default function Routes() {
  return (
    <Stack.Navigator 
      initialRouteName="Users" 
      screenOptions={{ 
        headerTintColor: '#FFF' 
      }}
    >
      <Stack.Screen 
        name="SignIn" 
        component={SignIn}
      />
    </Stack.Navigator>
  );
}