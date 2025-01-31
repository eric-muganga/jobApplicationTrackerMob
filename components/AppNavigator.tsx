import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardView from '../views/DashboardView';
import NewApplicationView from '../views/NewApplicationView';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={DashboardView} />
      <Stack.Screen name="NewApplication" component={NewApplicationView} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
