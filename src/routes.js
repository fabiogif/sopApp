import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from './pages/signIn';
import Main from './pages/main';

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator   initialRouteName="Main"
        screenOptions={{ 
        headerTintColor: '#FFF' 
      }}
    >
      <Stack.Screen 
        name="Main" 
        component={Main}
      />
     
    </Stack.Navigator>
  );
}