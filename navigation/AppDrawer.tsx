import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Dashboard from '@/screens/Dashboard';
import Scanner from '@/screens/Scanner';

const Drawer = createDrawerNavigator();

const AppDrawer = () => {
  return (
    <Drawer.Navigator initialRouteName="Dashboard">
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Scanner" component={Scanner} />
    </Drawer.Navigator>
  );
};

export default AppDrawer;
