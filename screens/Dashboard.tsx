import React, { useContext, useLayoutEffect, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '@/context/AuthContext'; // Adjust path if your AuthContext is elsewhere
import LogoutToolbar from '@/components/toolbar/LogoutToolbar'; // Adjust path if needed

interface Props {
  navigation: any;
}

const Dashboard = ({ navigation }: Props) => {
  const { user } = useContext(AuthContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#017fb7' },
      headerRight: () => <LogoutToolbar navigation={navigation} />,
      headerTintColor: '#fff',
      headerLeft: () => null,
    });
  }, [navigation]);

  useEffect(() => {
    // Disable back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/cuddlers-logo-android.png')}
        style={styles.logo}
        resizeMode="cover"
      />
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.title}>{user?.name || 'User'}!</Text>
      <View style={{ height: 32 }} />
      <View style={styles.blurButtonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Scanner')}
          style={styles.blurButton}
        >
          <Text
            style={{
              textAlign: 'center',
              fontSize: 18,
              fontWeight: 'bold',
              color: '#007bff',
            }}
          >
            Scan now
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.footerText}>
        All Rights Reserved by Emmanuel Innovations.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  blurButtonContainer: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurButton: {
    width: '100%',
    textAlign: 'center',
    paddingVertical: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    backgroundColor: 'rgba(0, 123, 255, 0.12)',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  footerText: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});

export default Dashboard;
