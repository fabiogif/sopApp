import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
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
      <Stack.Screen 
        name="Main" 
        component={Main}
      />
    </Stack.Navigator>
  );
}