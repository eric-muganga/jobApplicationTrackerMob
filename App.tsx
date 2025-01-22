/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {
  StyleSheet, View,
} from 'react-native';

import { useSelector} from 'react-redux';
import { RootState} from './store/store.ts';
import Icon from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import DashboardView from './views/DashboardView.tsx';
import KanbanBoardView from './views/KanbanBoardView.tsx';
import ProfileView from './views/ProfileView.tsx';
import LoginView from './views/LoginView.tsx';



function App(): React.JSX.Element {
  const Tab = createBottomTabNavigator();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return (
    <NavigationContainer>
      {isAuthenticated ? (
          <Tab.Navigator
            screenOptions={({route}) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if(route.name === 'Dashboard'){
                  iconName = focused ? 'home' : 'home-outline';
                }else if(route.name === 'Profile'){
                  iconName = focused ? 'person' : 'person-outline';
                }else if(route.name === 'Applications'){
                  iconName = focused ? 'briefcase' : 'briefcase-outline';
                }
                // Return the Icon component
                return <Icon name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: 'blue',
              tabBarInactiveTintColor: 'gray',
            })}
          >
            <Tab.Screen name="Dashboard" component={DashboardView} />
            <Tab.Screen name="Applications" component={KanbanBoardView} />
            <Tab.Screen name="Profile" component={ProfileView} />
          </Tab.Navigator>
      ) : (
        <LoginView />
      )
      }
    </NavigationContainer>
  );
}

export default App;
