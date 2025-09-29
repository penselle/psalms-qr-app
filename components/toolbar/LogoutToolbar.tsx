import React, { useContext } from 'react';
import { TouchableOpacity, Alert, Text, View, StyleSheet } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { AuthContext } from '@/context/AuthContext';

type RootDrawerParamList = {
  Login: undefined;
  Dashboard: undefined;
  Scanner: undefined;
};

type ToolbarNavigationProp = DrawerNavigationProp<RootDrawerParamList, any>;

interface Props {
  navigation: ToolbarNavigationProp;
}

const LogoutToolbar = ({ navigation }: Props) => {
  const { logout } = useContext(AuthContext);

  const handleMenuPress = () => {
    Alert.alert(
      '',
      'Are you sure you want to logout?',
      [
        { text: 'Logout', onPress: handleLogout },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleLogout = () => {
    logout();
    navigation.navigate('Login');
  };

  return (
    <View style={[styles.toolbar, { backgroundColor: '#017fb7' }]}>
      <TouchableOpacity onPress={handleMenuPress} style={{ marginRight: 15, padding: 5 }}>
        <Text style={{ fontSize: 24, color: '#fff' }}>⋮</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#017fb7',
    // ...other styles
  },
  // ...existing styles
});

export default LogoutToolbar;
