import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { View, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Dashboard: undefined;
  Scanner: undefined;
};

const SplashScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 2000); // 2 seconds

    // Disable back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

    return () => {
      clearTimeout(timer);
      backHandler.remove();
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/cuddlers-logo-android.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default SplashScreen;
