import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import SignIn from '../pages/signIn/';
import Main from '../pages/main';

const Stack  = createStackNavigator();

export default function DashboardRoutes() {
    return (
      <Stack.Navigator 
      headerMode="none"
      screenOptions={{
          cardStyle:{
              backgroundColor: Colors.white
          }
      }}>
        <Stack.Screen
          name="Main"
          component={Main}          
        />       
        <Stack.Screen
          name="SignIn"
          component={SignIn}          
        />    
      </Stack.Navigator>
    
    
    )
};

