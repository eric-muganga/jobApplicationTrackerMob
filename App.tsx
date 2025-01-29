import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store/store.ts';
import Icon from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import DashboardView from './views/DashboardView.tsx';
import KanbanBoardView from './views/KanbanBoardView.tsx';
import ProfileView from './views/ProfileView.tsx';
import LoginView from './views/LoginView.tsx';
import RegisterView from './views/RegisterView.tsx';
import NewApplicationView from './views/NewApplicationView.tsx';

const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();
const DashboardStack = createStackNavigator();
const KanbanStack = createStackNavigator();

const App = (): React.JSX.Element => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const AuthNavigator = () => (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginView} />
      <AuthStack.Screen name="Register" component={RegisterView} />
    </AuthStack.Navigator>
  );

  // Dashboard Navigator for dashboard and new application screens
  const DashboardNavigator = () => (
    <DashboardStack.Navigator>
      {/* Ensure only one Dashboard screen */}
      <DashboardStack.Screen
        name="Dashboard"
        component={DashboardView}
        options={{ headerShown: false }}
      />
      <DashboardStack.Screen
        name="NewApplication"
        component={NewApplicationView}
        options={{ title: 'New Application' }}
      />
    </DashboardStack.Navigator>
  );
  //
  const KanbanNavigator = () => (
    <KanbanStack.Navigator>
      <KanbanStack.Screen
        name="KanbanBoard"
        component={KanbanBoardView}
        options={{ headerShown: false }}
      />
      <KanbanStack.Screen
        name="NewApplication"
        component={NewApplicationView}
        options={{ title: 'New Application' }}
      />
    </KanbanStack.Navigator>
  );

  const MainNavigator = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Applications') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardNavigator} />
      <Tab.Screen name="Applications" component={KanbanNavigator} />
      <Tab.Screen name="Profile" component={ProfileView} />
    </Tab.Navigator>
  );

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default App;
