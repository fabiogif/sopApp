import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Main from '../pages/main';

const Tab = createBottomTabNavigator();

function Wildcard({ title }) {
  return <Text>Wildcard {title}</Text>
}

export default function DashboardRoutes() {
  return (
    <Tab.Navigator>
    <Tab.Screen name="Main" component={
      () => <Wildcard title="Teste Home" />
      } />

    <Tab.Screen name="Settings" component={ 
      () => <Wildcard title="TESTE" />
      } />
  </Tab.Navigator>
  );
} 